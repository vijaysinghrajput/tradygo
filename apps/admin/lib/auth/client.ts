'use client';

import { LoginRequest } from './types';

export interface LoginOptions {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Login user via internal API route
 */
export async function login(options: LoginOptions): Promise<LoginResult> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: options.email,
        password: options.password,
        remember: options.remember,
      }),
      cache: 'no-store',
    });

    const data = await response.json();
    console.log('Login API response:', { status: response.status, data });

    if (!response.ok) {
      console.log('Login failed:', data);
      return {
        success: false,
        error: data.message || data.error || 'Login failed',
      };
    }

    console.log('Login successful, returning success: true');
    return {
      success: true,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

/**
 * Logout user and redirect to configured logout URL
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with redirect even if logout request fails
  }
  
  // Get dynamic redirect configuration and redirect
  try {
    const { configService } = await import('../config/config.service');
    const redirectConfig = await configService.getRedirectConfig();
    window.location.href = '/login';
  } catch (error) {
    console.error('Failed to get redirect config, using default:', error);
    // Fallback to default login page
    window.location.href = '/login';
  }
}