import { Linking } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';

export interface DeepLinkData {
  url: string;
  scheme?: string;
  host?: string;
  path?: string;
  queryParams?: Record<string, string>;
}

export interface ParsedDeepLink {
  screen: keyof RootStackParamList;
  params?: any;
}

class DeepLinkService {
  private navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList>> | null = null;
  private pendingUrl: string | null = null;

  /**
   * Initialize deep link service with navigation reference
   */
  initialize(navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList>>) {
    this.navigationRef = navigationRef;
    
    // Handle initial URL if app was opened via deep link
    this.getInitialURL();
    
    // Listen for incoming URLs while app is running
    const subscription = Linking.addEventListener('url', this.handleIncomingURL.bind(this));
    
    return () => {
      subscription?.remove();
    };
  }

  /**
   * Get initial URL if app was opened via deep link
   */
  private async getInitialURL() {
    try {
      const url = await Linking.getInitialURL();
      if (url) {
        this.handleDeepLink(url);
      }
    } catch (error) {
      console.error('Error getting initial URL:', error);
    }
  }

  /**
   * Handle incoming URL while app is running
   */
  private handleIncomingURL = (event: { url: string }) => {
    this.handleDeepLink(event.url);
  };

  /**
   * Parse deep link URL
   */
  parseDeepLink(url: string): DeepLinkData {
    try {
      const urlObj = new URL(url);
      const queryParams: Record<string, string> = {};
      
      urlObj.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      return {
        url,
        scheme: urlObj.protocol.replace(':', ''),
        host: urlObj.hostname,
        path: urlObj.pathname,
        queryParams,
      };
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return { url };
    }
  }

  /**
   * Convert deep link to navigation action
   */
  convertToNavigation(deepLinkData: DeepLinkData): ParsedDeepLink | null {
    const { path, queryParams } = deepLinkData;
    
    if (!path) return null;

    // Remove leading slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const pathSegments = cleanPath.split('/');

    switch (pathSegments[0]) {
      case 'product':
      case 'p':
        if (pathSegments[1]) {
          return {
            screen: 'Main',
            params: {
              screen: 'ProductDetail',
              params: {
                productId: pathSegments[1],
                variantId: queryParams?.variant,
              },
            },
          };
        }
        break;

      case 'category':
      case 'c':
        if (pathSegments[1]) {
          return {
            screen: 'Main',
            params: {
              screen: 'ProductList',
              params: {
                categoryId: pathSegments[1],
                categoryName: queryParams?.name,
              },
            },
          };
        }
        break;

      case 'search':
        return {
          screen: 'Main',
          params: {
            screen: 'Search',
            params: {
              query: queryParams?.q || queryParams?.query,
            },
          },
        };

      case 'cart':
        return {
          screen: 'Main',
          params: {
            screen: 'Cart',
          },
        };

      case 'orders':
        if (pathSegments[1]) {
          return {
            screen: 'Main',
            params: {
              screen: 'OrderDetail',
              params: {
                orderId: pathSegments[1],
              },
            },
          };
        } else {
          return {
            screen: 'Main',
            params: {
              screen: 'OrdersList',
            },
          };
        }

      case 'account':
      case 'profile':
        return {
          screen: 'Main',
          params: {
            screen: 'Account',
          },
        };

      case 'addresses':
        return {
          screen: 'Main',
          params: {
            screen: 'AddressList',
          },
        };

      case 'checkout':
        return {
          screen: 'Main',
          params: {
            screen: 'Checkout',
          },
        };

      case 'login':
        return {
          screen: 'Auth',
          params: {
            screen: 'PhoneLogin',
          },
        };

      case 'register':
      case 'signup':
        return {
          screen: 'Auth',
          params: {
            screen: 'EmailLogin',
            params: {
              mode: 'register',
            },
          },
        };

      default:
        // Default to home screen
        return {
          screen: 'Main',
          params: {
            screen: 'Home',
          },
        };
    }

    return null;
  }

  /**
   * Handle deep link navigation
   */
  handleDeepLink(url: string) {
    console.log('Handling deep link:', url);
    
    const deepLinkData = this.parseDeepLink(url);
    const navigationAction = this.convertToNavigation(deepLinkData);
    
    if (!navigationAction) {
      console.warn('Could not parse deep link:', url);
      return;
    }

    // If navigation is not ready, store the URL for later
    if (!this.navigationRef?.current?.isReady()) {
      this.pendingUrl = url;
      return;
    }

    this.navigate(navigationAction);
  }

  /**
   * Navigate to screen based on parsed deep link
   */
  private navigate(action: ParsedDeepLink) {
    if (!this.navigationRef?.current) {
      console.warn('Navigation ref not available');
      return;
    }

    try {
      this.navigationRef.current.navigate(action.screen as any, action.params);
    } catch (error) {
      console.error('Error navigating to deep link:', error);
    }
  }

  /**
   * Handle pending deep link after navigation is ready
   */
  handlePendingDeepLink() {
    if (this.pendingUrl && this.navigationRef?.current?.isReady()) {
      this.handleDeepLink(this.pendingUrl);
      this.pendingUrl = null;
    }
  }

  /**
   * Generate deep link URL
   */
  generateDeepLink(screen: string, params?: Record<string, string>): string {
    const baseUrl = 'tradygo://';
    let path = '';
    
    switch (screen) {
      case 'ProductDetail':
        path = `p/${params?.productId}`;
        if (params?.variantId) {
          path += `?variant=${params.variantId}`;
        }
        break;
        
      case 'ProductList':
        path = `c/${params?.categoryId}`;
        if (params?.categoryName) {
          path += `?name=${encodeURIComponent(params.categoryName)}`;
        }
        break;
        
      case 'Search':
        path = 'search';
        if (params?.query) {
          path += `?q=${encodeURIComponent(params.query)}`;
        }
        break;
        
      case 'OrderDetail':
        path = `orders/${params?.orderId}`;
        break;
        
      default:
        path = screen.toLowerCase();
    }
    
    return baseUrl + path;
  }

  /**
   * Share deep link
   */
  async shareDeepLink(screen: string, params?: Record<string, string>) {
    const url = this.generateDeepLink(screen, params);
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open deep link:', url);
      }
    } catch (error) {
      console.error('Error sharing deep link:', error);
    }
  }

  /**
   * Open external URL
   */
  async openExternalURL(url: string) {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening external URL:', error);
    }
  }
}

export const deepLinkService = new DeepLinkService();
export default deepLinkService;

// Deep link schemes
export const DEEP_LINK_SCHEMES = {
  TRADYGO: 'tradygo',
  HTTPS: 'https',
  HTTP: 'http',
} as const;

// Deep link hosts
export const DEEP_LINK_HOSTS = {
  TRADYGO: 'tradygo.in',
  WWW_TRADYGO: 'www.tradygo.in',
} as const;