import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('SUPER_ADMIN' | 'ADMIN' | 'SELLER' | 'CUSTOMER')[]) => SetMetadata(ROLES_KEY, roles);