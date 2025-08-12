export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface TokenPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string; // User ID
  tokenVersion: number;
  iat?: number;
  exp?: number;
}