import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '../../../../lib/auth/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('tg_at')?.value;
    
    // Call backend logout if we have an access token (ignore failures)
    if (accessToken) {
      try {
        await fetch(`${API_BASE}/api/v1/auth/logout`, {
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
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 204 }
    );

    // Clear authentication cookies
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Even on error, clear cookies and return success
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 204 }
    );
    
    clearAuthCookies(response);
    return response;
  }
}