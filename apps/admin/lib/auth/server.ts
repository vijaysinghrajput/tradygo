import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { User, AuthTokens, isAdminRole } from './types';

// Build a versioned API base that avoids double "/api/v1"
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tradygo.in';
const NORMALIZED_API_BASE = (RAW_API_BASE || '').replace(/\/+$/, '');
const API_BASE = NORMALIZED_API_BASE.endsWith('/api/v1')
  ? NORMALIZED_API_BASE
  : `${NORMALIZED_API_BASE}/api/v1`;

/**
 * Get tokens from httpOnly cookies
 */
export function getTokensFromCookies(): AuthTokens {
  const cookieStore = cookies();
  
  return {
    accessToken: cookieStore.get('tg_at')?.value || null,
    refreshToken: cookieStore.get('tg_rt')?.value || null,
  };
}

/**
 * Set tokens as httpOnly cookies
 */
export function setTokensAsCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Access token - 15 minutes
  response.cookies.set('tg_at', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 minutes
  });
  
  // Refresh token - 30 days
  response.cookies.set('tg_rt', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set('tg_at', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  
  response.cookies.set('tg_rt', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Fetch current user from API or return null
 */
export async function fetchMeOrNull(): Promise<User | null> {
  const { accessToken, refreshToken } = getTokensFromCookies();
  
  if (!accessToken) {
    // Try to refresh token
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `tg_rt=${refreshToken}`,
          },
          cache: 'no-store',
        });
        
        if (refreshResponse.ok) {
          // Retry with new token
          const newTokens = getTokensFromCookies();
          if (newTokens.accessToken) {
            return await fetchUserWithToken(newTokens.accessToken);
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
    return null;
  }
  
  return await fetchUserWithToken(accessToken);
}

/**
 * Fetch user with access token
 */
async function fetchUserWithToken(accessToken: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

/**
 * Ensure user is admin or redirect to login
 */
export async function ensureAdminOrRedirect(): Promise<User> {
  const user = await fetchMeOrNull();
  
  if (!user) {
    redirect('/login');
  }
  
  if (!isAdminRole(user.role)) {
    redirect('/login?error=access_denied');
  }
  
  return user;
}

/**
 * Check if user is authenticated admin (for middleware)
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const user = await fetchMeOrNull();
  return user !== null && isAdminRole(user.role);
}