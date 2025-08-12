import { cookies } from 'next/headers';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  isEmailVerified: boolean;
}

/**
 * Server action to get the current user from cookies
 */
export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return null;
    }

    // Call the API to get user info
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Server action to logout user
 */
export async function logout(): Promise<void> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (accessToken) {
      // Call logout API
      await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Clear cookies regardless of API call success
    const cookieStore = cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRole: User['role']): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return user !== null;
}