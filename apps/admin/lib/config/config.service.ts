interface AppBranding {
  name: string;
  logoUrl: string;
}

interface AuthConfig {
  allowRoles: string[];
  otpEnabled: boolean;
}

interface RedirectConfig {
  admin: string;
  seller: string;
}

interface UiConfig {
  helpUrl?: string;
}

interface PublicConfig {
  brand: AppBranding;
  ui: UiConfig;
  auth: AuthConfig;
  redirects: RedirectConfig;
}

class ConfigService {
  private config: PublicConfig | null = null;

  private async fetchConfig(): Promise<PublicConfig> {
    // Use production API URL directly - no fallbacks to localhost
    const apiBase = 'https://api.tradygo.in/api/v1';
    
    try {
      const response = await fetch(`${apiBase}/public/config`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch config, using production defaults:', error);
      
      // Production-only configuration
      return {
        brand: {
          name: 'TradyGo',
          logoUrl: 'https://cdn.tradygo.in/brand/admin-logo.svg',
        },
        ui: {
          helpUrl: 'https://docs.tradygo.in/admin',
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

  async getConfig(): Promise<PublicConfig> {
    if (this.config) {
      return this.config;
    }

    this.config = await this.fetchConfig();
    return this.config;
  }

  async refreshConfig(): Promise<PublicConfig> {
    this.config = null;
    return this.getConfig();
  }

  async getBranding(): Promise<AppBranding> {
    const config = await this.getConfig();
    return config.brand;
  }

  async getUiConfig(): Promise<UiConfig> {
    const config = await this.getConfig();
    return config.ui;
  }

  async getAuthConfig(): Promise<AuthConfig> {
    const config = await this.getConfig();
    return config.auth;
  }

  async getRedirectConfig(): Promise<RedirectConfig> {
    const config = await this.getConfig();
    return config.redirects;
  }

  // Clear cache to force refetch
  clearCache(): void {
    this.config = null;
  }
}

export const configService = new ConfigService();
export type { AppBranding, AuthConfig, RedirectConfig, UiConfig, PublicConfig };