export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'SELLER';
  name?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export type AdminRole = 'ADMIN' | 'SUPER_ADMIN';

export const ADMIN_ROLES: AdminRole[] = ['ADMIN', 'SUPER_ADMIN'];

export const isAdminRole = (role: string): role is AdminRole => {
  return ADMIN_ROLES.includes(role as AdminRole);
};