import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface DemoCredential {
  email: string;
  password: string;
  role: string;
  displayName: string;
  description: string;
}

export interface AppBranding {
  name: string;
  logoUrl: string;
  primaryColor: string;
}

export interface AuthConfig {
  demoMode: boolean;
  allowedRoles: string[];
  sessionTimeout: number;
}

export interface RedirectConfig {
  afterLogin: string;
  afterLogout: string;
  unauthorized: string;
}

@Injectable()
export class DynamicConfigService {
  constructor(private configService: ConfigService) {}

  getBranding(): AppBranding {
    return {
      name: this.configService.get('APP_NAME', 'TradyGo Admin'),
      logoUrl: this.configService.get('APP_LOGO_URL', '/logo.svg'),
      primaryColor: this.configService.get('APP_PRIMARY_COLOR', '#3B82F6'),
    };
  }

  getAuthConfig(): AuthConfig {
    return {
      demoMode: this.configService.get('DEMO_MODE', 'true') === 'true',
      allowedRoles: this.configService.get('ALLOWED_ROLES', 'ADMIN,SUPER_ADMIN').split(','),
      sessionTimeout: parseInt(this.configService.get('SESSION_TIMEOUT', '15'), 10),
    };
  }

  getRedirectConfig(): RedirectConfig {
    return {
      afterLogin: this.configService.get('REDIRECT_AFTER_LOGIN', '/dashboard'),
      afterLogout: this.configService.get('REDIRECT_AFTER_LOGOUT', '/login'),
      unauthorized: this.configService.get('REDIRECT_UNAUTHORIZED', '/login?error=access_denied'),
    };
  }

  getDemoCredentials(): DemoCredential[] {
    const demoMode = this.getAuthConfig().demoMode;
    if (!demoMode) return [];

    return [
      {
        email: this.configService.get('DEMO_SUPER_ADMIN_EMAIL', 'sa@tradygo.in'),
        password: this.configService.get('DEMO_SUPER_ADMIN_PASSWORD', 'Admin@12345!'),
        role: 'SUPER_ADMIN',
        displayName: 'Super Admin',
        description: 'Super administrator account with full access',
      },
      {
        email: this.configService.get('DEMO_ADMIN_EMAIL', 'admin@tradygo.in'),
        password: this.configService.get('DEMO_ADMIN_PASSWORD', 'Admin@12345!'),
        role: 'ADMIN',
        displayName: 'Admin',
        description: 'Administrator account with admin access',
      },
    ];
  }

  hasPermission(role: string, resource: string, action: string): boolean {
    // Define permissions based on role
    const permissions = {
      SUPER_ADMIN: {
        dashboard: ['read', 'write'],
        users: ['read', 'write', 'delete'],
        settings: ['read', 'write'],
        orders: ['read', 'write', 'delete'],
        products: ['read', 'write', 'delete'],
      },
      ADMIN: {
        dashboard: ['read'],
        users: ['read', 'write'],
        settings: ['read'],
        orders: ['read', 'write'],
        products: ['read', 'write'],
      },
    };

    const rolePermissions = permissions[role as keyof typeof permissions];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(action);
  }

  getAllowedRoles(): string[] {
    return this.getAuthConfig().allowedRoles;
  }

  isRoleAllowed(role: string): boolean {
    return this.getAllowedRoles().includes(role);
  }

  getPublicConfig() {
    return {
      branding: this.getBranding(),
      auth: {
        demoMode: this.getAuthConfig().demoMode,
        demoCredentials: this.getDemoCredentials(),
      },
      redirects: this.getRedirectConfig(),
    };
  }
}