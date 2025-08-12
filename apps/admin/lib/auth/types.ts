export interface User {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'SELLER' | 'CUSTOMER';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const ADMIN_ROLES: Role[] = ['ADMIN', 'SUPER_ADMIN'];

export const isAdminRole = (role: string): role is Role => {
  return ADMIN_ROLES.includes(role as Role);
};