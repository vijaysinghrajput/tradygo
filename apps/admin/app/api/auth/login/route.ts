import { NextRequest, NextResponse } from 'next/server';
import { setTokensAsCookies } from '../../../../lib/auth/server';
import { LoginRequest, LoginResponse } from '../../../../lib/auth/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3005';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validate request body
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Proxy to backend API
    const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || 'Login failed' },
        { status: response.status }
      );
    }

    const loginResponse: LoginResponse = data;
    
    // Check if user has admin role
    if (loginResponse.user.role !== 'ADMIN' && loginResponse.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Create response
    const nextResponse = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: loginResponse.user.id,
          email: loginResponse.user.email,
          role: loginResponse.user.role,
        }
      },
      { status: 200 }
    );

    // Set httpOnly cookies
    setTokensAsCookies(nextResponse, {
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
    });

    return nextResponse;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}