import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface PublicConfig {
  brand: {
    name: string;
    logoUrl: string;
  };
  ui: {
    helpUrl?: string;
    showDemoCreds: boolean;
  };
  auth: {
    allowRoles: string[];
    otpEnabled: boolean;
  };
  redirects: {
    admin: string;
    seller: string;
  };
  demo?: {
    users: Array<{
      label: string;
      email: string;
      password: string;
      role: string;
    }>;
  };
}

export interface RawConfig {
  brandName: string;
  brandLogoUrl: string;
  uiHelpUrl?: string;
  authAdminRoles: string[];
  authOtpEnabled: boolean;
  uiShowDemoCreds: boolean;
  defaultRedirectAdmin: string;
  defaultRedirectSeller: string;
}

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);
  private configCache: PublicConfig | null = null;
  private lastCacheTime = 0;
  private readonly cacheTtl: number;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.cacheTtl = parseInt(
      this.configService.get('CONFIG_CACHE_TTL_MS', '15000'),
      10,
    );
  }

  private async loadRawConfig(): Promise<RawConfig> {
    try {
      // Load from database first
      const platformConfig = await this.prisma.platformConfig.findUnique({
        where: { id: 'cfg-singleton' },
      });

      if (platformConfig) {
        return {
          brandName: platformConfig.brandName,
          brandLogoUrl: platformConfig.brandLogoUrl,
          uiHelpUrl: platformConfig.uiHelpUrl,
          authAdminRoles: platformConfig.authAdminRoles as string[],
          authOtpEnabled: platformConfig.authOtpEnabled,
          uiShowDemoCreds: platformConfig.uiShowDemoCreds,
          defaultRedirectAdmin: platformConfig.defaultRedirectAdmin,
          defaultRedirectSeller: platformConfig.defaultRedirectSeller,
        };
      }
    } catch (error) {
      this.logger.warn('Failed to load config from database, using env fallback:', error);
    }

    // Fallback to environment variables
    const brandName = this.configService.get('PLATFORM_BRAND_NAME', 'TradyGo');
    const brandLogoUrl = this.configService.get(
      'PLATFORM_BRAND_LOGO_URL',
      'https://cdn.tradygo.in/brand/admin-logo.svg',
    );
    const uiHelpUrl = this.configService.get(
      'UI_HELP_URL',
      'https://docs.tradygo.in/admin',
    );
    const authAdminRoles = JSON.parse(
      this.configService.get('AUTH_ADMIN_ROLES_JSON', '["ADMIN","SUPER_ADMIN"]'),
    );
    const authOtpEnabled = this.configService.get('AUTH_OTP_ENABLED') === '1';
    const uiShowDemoCreds =
      this.configService.get('NODE_ENV') !== 'production' &&
      this.configService.get('UI_SHOW_DEMO_CREDS') === '1';
    const defaultRedirectAdmin = this.configService.get(
      'REDIRECT_ADMIN',
      '/dashboard',
    );
    const defaultRedirectSeller = this.configService.get(
      'REDIRECT_SELLER',
      '/orders',
    );

    return {
      brandName,
      brandLogoUrl,
      uiHelpUrl,
      authAdminRoles,
      authOtpEnabled,
      uiShowDemoCreds,
      defaultRedirectAdmin,
      defaultRedirectSeller,
    };
  }

  private async loadDemoUsers(): Promise<Array<{
    label: string;
    email: string;
    password: string;
    role: string;
  }>> {
    try {
      // Load from database first
      const demoCredentials = await this.prisma.demoCredential.findMany({
        where: { platformConfigId: 'cfg-singleton' },
        select: {
          label: true,
          email: true,
          passwordPlaintext: true,
          role: true,
        },
      });

      if (demoCredentials.length > 0) {
        return demoCredentials.map(cred => ({
          label: cred.label,
          email: cred.email,
          password: cred.passwordPlaintext || 'Admin@12345!',
          role: cred.role,
        }));
      }
    } catch (error) {
      this.logger.warn('Failed to load demo users from database, using fallback:', error);
    }

    // Fallback to hardcoded demo users
    return [
      {
        label: 'Super Admin',
        email: 'sa@tradygo.in',
        password: 'Admin@12345!',
        role: 'SUPER_ADMIN',
      },
      {
        label: 'Admin',
        email: 'admin@tradygo.in',
        password: 'Admin@12345!',
        role: 'ADMIN',
      },
    ];
  }

  private async buildPublicConfig(rawConfig: RawConfig): Promise<PublicConfig> {
    const publicConfig: PublicConfig = {
      brand: {
        name: rawConfig.brandName,
        logoUrl: rawConfig.brandLogoUrl,
      },
      ui: {
        helpUrl: rawConfig.uiHelpUrl,
        showDemoCreds: rawConfig.uiShowDemoCreds,
      },
      auth: {
        allowRoles: rawConfig.authAdminRoles,
        otpEnabled: rawConfig.authOtpEnabled,
      },
      redirects: {
        admin: rawConfig.defaultRedirectAdmin,
        seller: rawConfig.defaultRedirectSeller,
      },
    };

    // Include demo users only in non-production and when enabled
    if (
      this.configService.get('NODE_ENV') !== 'production' &&
      rawConfig.uiShowDemoCreds
    ) {
      const demoUsers = await this.loadDemoUsers();
      publicConfig.demo = { users: demoUsers };
    }

    return publicConfig;
  }

  private isCacheValid(): boolean {
    return (
      this.configCache !== null &&
      Date.now() - this.lastCacheTime < this.cacheTtl
    );
  }

  async getPublicConfig(): Promise<PublicConfig> {
    if (this.isCacheValid()) {
      return this.configCache!;
    }

    try {
      const rawConfig = await this.loadRawConfig();
      const publicConfig = await this.buildPublicConfig(rawConfig);
      
      this.configCache = publicConfig;
      this.lastCacheTime = Date.now();
      
      this.logger.debug('Config cache refreshed');
      return publicConfig;
    } catch (error) {
      this.logger.error('Failed to load config:', error);
      
      // Return fallback config
      return {
        brand: {
          name: 'TradyGo',
          logoUrl: 'https://cdn.tradygo.in/brand/admin-logo.svg',
        },
        ui: {
          helpUrl: 'https://docs.tradygo.in/admin',
          showDemoCreds: false,
        },
        auth: {
          allowRoles: ['ADMIN', 'SUPER_ADMIN'],
          otpEnabled: false,
        },
        redirects: {
          admin: '/dashboard',
          seller: '/orders',
        },
      };
    }
  }

  async getRawConfig(): Promise<RawConfig> {
    return this.loadRawConfig();
  }

  async updateConfig(updates: Partial<RawConfig>): Promise<void> {
    // In production, this would update the PlatformConfig table
    // For now, we'll just bust the cache
    this.configCache = null;
    this.lastCacheTime = 0;
    this.logger.log('Config cache busted due to update');
  }

  bustCache(): void {
    this.configCache = null;
    this.lastCacheTime = 0;
    this.logger.log('Config cache manually busted');
  }

  generateETag(config: PublicConfig): string {
    // Generate ETag based on config content
    const configStr = JSON.stringify(config);
    return Buffer.from(configStr).toString('base64').slice(0, 16);
  }
}