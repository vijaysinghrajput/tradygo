import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'tradygo://',
    'https://tradygo.in',
    'https://www.tradygo.in',
  ],
  config: {
    screens: {
      Auth: {
        screens: {
          PhoneLogin: 'login',
          EmailLogin: 'login/email',
          OtpVerify: 'verify-otp',
        },
      },
      Main: {
        screens: {
          HomeTabs: {
            screens: {
              Home: '',
              Categories: 'categories',
              Cart: 'cart',
              Account: 'account',
            },
          },
          ProductDetail: {
            path: '/p/:productId',
            parse: {
              productId: (productId: string) => productId,
            },
          },
          ProductList: {
            path: '/category/:categorySlug',
            parse: {
              categorySlug: (categorySlug: string) => categorySlug,
            },
          },
          Search: {
            path: '/search',
            parse: {
              query: (query: string) => query,
            },
          },
          Checkout: 'checkout',
          OrderDetail: {
            path: '/orders/:orderId',
            parse: {
              orderId: (orderId: string) => orderId,
            },
          },
          AddressList: 'addresses',
          AddressForm: 'addresses/new',
        },
      },
    },
  },
};