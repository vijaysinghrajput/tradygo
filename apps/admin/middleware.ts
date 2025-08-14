import { NextRequest, NextResponse } from 'next/server';

// Build a versioned API base that avoids double "/api/v1"
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const NORMALIZED_API_BASE = (RAW_API_BASE || '').replace(/\/+$/, '');
const API_BASE = NORMALIZED_API_BASE.endsWith('/api/v1')
  ? NORMALIZED_API_BASE
  : `${NORMALIZED_API_BASE}/api/v1`;

function isLoginRoute(pathname: string) {
  return pathname === '/login';
}

function isPublicPath(pathname: string) {
  const publicPaths = ['/_next', '/favicon.ico', '/assets', '/api/auth'];
  return publicPaths.some((p) => pathname.startsWith(p));
}

function isProtectedPath(pathname: string) {
  if (isPublicPath(pathname) || isLoginRoute(pathname)) return false;
  return true;
}

async function verifyAccessToken(token: string): Promise<{ valid: boolean; isAdmin: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return { valid: false, isAdmin: false };
    const user = await res.json();
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
    return { valid: true, isAdmin };
  } catch {
    return { valid: false, isAdmin: false };
  }
}

async function tryRefreshToken(request: NextRequest): Promise<{ success: boolean; response?: NextResponse }> {
  const refreshToken = request.cookies.get('tg_rt')?.value;
  if (!refreshToken) return { success: false };
  try {
    const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `tg_rt=${refreshToken}` },
      cache: 'no-store',
    });
    if (refreshResponse.ok) {
      const response = NextResponse.next();
      const setCookieHeader = refreshResponse.headers.get('set-cookie');
      if (setCookieHeader) response.headers.set('set-cookie', setCookieHeader);
      return { success: true, response };
    }
  } catch {}
  return { success: false };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const accessToken = request.cookies.get('tg_at')?.value;

  // If accessing /login and already authenticated admin, redirect to dashboard
  if (isLoginRoute(pathname)) {
    if (accessToken) {
      const { valid, isAdmin } = await verifyAccessToken(accessToken);
      if (valid && isAdmin) return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Skip public assets and internal auth API routes
  if (!isProtectedPath(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // For protected paths, require a valid admin session
  if (!accessToken) {
    const refreshResult = await tryRefreshToken(request);
    if (refreshResult.success && refreshResult.response) {
      refreshResult.response.headers.set('x-pathname', pathname);
      return refreshResult.response;
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { valid, isAdmin } = await verifyAccessToken(accessToken);
  if (!valid) {
    const refreshResult = await tryRefreshToken(request);
    if (refreshResult.success && refreshResult.response) {
      refreshResult.response.headers.set('x-pathname', pathname);
      return refreshResult.response;
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!isAdmin) return NextResponse.redirect(new URL('/login?error=access_denied', request.url));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|api/auth).*)',
  ],
};
