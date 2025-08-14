import { NextRequest, NextResponse } from 'next/server';

// Build a versioned API base that avoids double "/api/v1"
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tradygo.in';
const NORMALIZED_API_BASE = (RAW_API_BASE || '').replace(/\/+$/, '');
const API_BASE = NORMALIZED_API_BASE.endsWith('/api/v1')
  ? NORMALIZED_API_BASE
  : `${NORMALIZED_API_BASE}/api/v1`;

/**
 * Check if the route should be protected
 */
function isProtectedRoute(pathname: string): boolean {
  // Allow auth routes, static files, and Next.js internals
  const publicPaths = [
    '/_next',
    '/favicon.ico',
    '/assets',
    '/api/auth',
  ];
  
  return !publicPaths.some(path => pathname.startsWith(path));
}

/**
 * Verify access token with API
 */
async function verifyAccessToken(token: string): Promise<{ valid: boolean; isAdmin: boolean }> {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return { valid: false, isAdmin: false };
    }
    
    const user = await response.json();
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
    return { valid: true, isAdmin };
  } catch {
    return { valid: false, isAdmin: false };
  }
}

/**
 * Try to refresh tokens via internal API
 */
async function tryRefreshToken(request: NextRequest): Promise<{ success: boolean; response?: NextResponse }> {
  const refreshToken = request.cookies.get('tg_rt')?.value;
  
  if (!refreshToken) {
    return { success: false };
  }

  try {
    const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `tg_rt=${refreshToken}`,
      },
      cache: 'no-store',
    });

    if (refreshResponse.ok) {
      // Create a response that continues to the original request
      const response = NextResponse.next();
      
      // Copy the new cookies from the refresh response
      const setCookieHeader = refreshResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        response.headers.set('set-cookie', setCookieHeader);
      }
      
      return { success: true, response };
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  return { success: false };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // In development, bypass auth middleware entirely to avoid redirect loops while testing
  if (process.env.NODE_ENV !== 'production') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  
  // Add pathname to headers for layout detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  
  // Skip middleware for non-protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const accessToken = request.cookies.get('tg_at')?.value;

  // Special handling for login page
  if (pathname === '/login') {
    // If user has access token, verify it and redirect to dashboard if valid
    if (accessToken) {
      const { valid, isAdmin } = await verifyAccessToken(accessToken);
      if (valid && isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    // Allow access to login page for unauthenticated users
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If no access token, try to refresh
  if (!accessToken) {
    const refreshResult = await tryRefreshToken(request);
    
    if (refreshResult.success && refreshResult.response) {
      // Add pathname header to the refresh response
      refreshResult.response.headers.set('x-pathname', pathname);
      return refreshResult.response;
    }
    
    // No valid tokens, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify access token and check admin role
  const { valid, isAdmin } = await verifyAccessToken(accessToken);
  
  if (!valid) {
    // Token is invalid, try to refresh
    const refreshResult = await tryRefreshToken(request);
    
    if (refreshResult.success && refreshResult.response) {
      refreshResult.response.headers.set('x-pathname', pathname);
      return refreshResult.response;
    }
    
    // Refresh failed, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (!isAdmin) {
    // User is not admin, redirect to login with error
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
  }
  
  // All checks passed, continue with request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - api/auth (auth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|api/auth).*)',
  ],
};