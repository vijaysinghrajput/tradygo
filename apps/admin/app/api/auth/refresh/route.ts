import { NextRequest, NextResponse } from 'next/server';
import { setTokensAsCookies } from '../../../../lib/auth/server';
import { RefreshResponse } from '../../../../lib/auth/types';

// Build a versioned API base that avoids double "/api/v1"
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tradygo.in';
const NORMALIZED_API_BASE = (RAW_API_BASE || '').replace(/\/+$/, '');
const API_BASE = NORMALIZED_API_BASE.endsWith('/api/v1')
  ? NORMALIZED_API_BASE
  : `${NORMALIZED_API_BASE}/api/v1`;

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('tg_rt')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Proxy to backend API
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear invalid refresh token
      const nextResponse = NextResponse.json(
        { error: data.message || data.error || 'Token refresh failed' },
        { status: response.status }
      );
      
      // Clear cookies on failure
      const isProduction = process.env.NODE_ENV === 'production';
      nextResponse.cookies.set('tg_at', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      nextResponse.cookies.set('tg_rt', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      
      return nextResponse;
    }

    const refreshResponse: RefreshResponse = data;

    // Create response with new tokens
    const nextResponse = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    // Set new tokens as cookies
    setTokensAsCookies(nextResponse, {
      accessToken: refreshResponse.accessToken,
      refreshToken: refreshResponse.refreshToken,
    });

    return nextResponse;
  } catch (error) {
    console.error('Refresh API error:', error);
    
    // Clear cookies on error
    const nextResponse = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    
    const isProduction = process.env.NODE_ENV === 'production';
    nextResponse.cookies.set('tg_at', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    nextResponse.cookies.set('tg_rt', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    
    return nextResponse;
  }
}