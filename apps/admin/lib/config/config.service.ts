interface AppBranding {
  name: string;
  logoUrl: string;
}

interface DemoCredential {
  label: string;
  email: string;
  password: string;
  role: string;
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
  showDemoCreds: boolean;
}

interface PublicConfig {
  brand: AppBranding;
  ui: UiConfig;
  auth: AuthConfig;
  redirects: RedirectConfig;
  demo?: {
    users: DemoCredential[];
  };
}

class ConfigService {
  private config: PublicConfig | null = null;
  private configPromise: Promise<PublicConfig> | null = null;

  private async fetchConfig(): Promise<PublicConfig> {
    // Normalize API base to ensure it ends with /api/v1 exactly once
    const rawApiBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tradygo.in';
    const normalized = (rawApiBase || '').replace(/\/+$/, '');
    const apiBase = normalized.endsWith('/api/v1') ? normalized : `${normalized}/api/v1`;
    
    try {
      const response = await fetch(`${apiBase}/public/config`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch configuration');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch config, using defaults:', error);
      
      // Fallback to default configuration
      return {
        brand: {
          name: 'TradyGo',
          logoUrl: 'https://cdn.tradygo.in/brand/admin-logo.svg',
        },
        ui: {
          helpUrl: 'https://docs.tradygo.in/admin',
          showDemoCreds: true,
        },
        auth: {
          allowRoles: ['ADMIN', 'SUPER_ADMIN'],
          otpEnabled: false,
        },
        redirects: {
          admin: '/dashboard',
          seller: '/orders',
        },
        demo: {
          users: [
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
          ],
        },
      };
    }
  }

  async getConfig(): Promise<PublicConfig> {
    if (this.config) {
      return this.config;
    }

    if (!this.configPromise) {
      this.configPromise = this.fetchConfig();
    }

    this.config = await this.configPromise;
    return this.config;
  }

  async getBranding(): Promise<AppBranding> {
    const config = await this.getConfig();
    return config.brand;
  }

  async getAuthConfig(): Promise<AuthConfig> {
    const config = await this.getConfig();
    return config.auth;
  }

  async getRedirectConfig(): Promise<RedirectConfig> {
    const config = await this.getConfig();
    return config.redirects;
  }

  async getUiConfig(): Promise<UiConfig> {
    const config = await this.getConfig();
    return config.ui;
  }

  async getDemoCredentials(): Promise<DemoCredential[]> {
    const config = await this.getConfig();
    return config.demo?.users || [];
  }

  async isDemoMode(): Promise<boolean> {
    const uiConfig = await this.getUiConfig();
    return uiConfig.showDemoCreds;
  }

  // Clear cache to force refetch
  clearCache(): void {
    this.config = null;
    this.configPromise = null;
  }
}

// Export singleton instance
export const configService = new ConfigService();
export type { AppBranding, DemoCredential, AuthConfig, RedirectConfig, UiConfig, PublicConfig };