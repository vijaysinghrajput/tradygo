import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '../../../../lib/auth/server';

// Build a versioned API base that avoids double "/api/v1"
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tradygo.in';
const NORMALIZED_API_BASE = (RAW_API_BASE || '').replace(/\/+$/, '');
const API_BASE = NORMALIZED_API_BASE.endsWith('/api/v1')
  ? NORMALIZED_API_BASE
  : `${NORMALIZED_API_BASE}/api/v1`;

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('tg_at')?.value;
    
    // Call backend logout if we have an access token (ignore failures)
    if (accessToken) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
      } catch (error) {
        // Ignore backend logout failures
        console.warn('Backend logout failed:', error);
      }
    }

    // Create response and clear cookies
    const response = new NextResponse(null, { status: 204 });

    // Clear authentication cookies
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Even on error, clear cookies and return success
    const response = new NextResponse(null, { status: 204 });
    
    clearAuthCookies(response);
    return response;
  }
}