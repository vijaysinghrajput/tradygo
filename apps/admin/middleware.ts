import { NextRequest, NextResponse } from 'next/server';

function isLoginRoute(pathname: string) {
  return pathname === '/login';
}

function isPublicPath(pathname: string) {
  const publicPrefixes = ['/_next', '/favicon.ico', '/assets', '/api/'];
  return publicPrefixes.some((p) => pathname.startsWith(p));
}

function isProtectedPath(pathname: string) {
  if (isPublicPath(pathname) || isLoginRoute(pathname)) return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const accessToken = request.cookies.get('tg_at')?.value;

  // If accessing /login and already authenticated admin, redirect to dashboard
  if (isLoginRoute(pathname)) {
    if (accessToken) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Skip public assets and internal auth API routes
  if (!isProtectedPath(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // For protected paths, require a session cookie. Do not verify via API in middleware to avoid flakiness.
  if (!accessToken) return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|api/).*)',
  ],
};
