import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  PhoneLogin: undefined;
  EmailLogin: undefined;
  OtpVerify: {
    phone: string;
  };
};

// Home Tabs
export type HomeTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Account: undefined;
};

// Main Stack
export type MainStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  ProductDetail: {
    productId: string;
    productSlug?: string;
  };
  ProductList: {
    categorySlug?: string;
    categoryId?: string;
    title?: string;
  };
  Search: {
    query?: string;
  };
  Checkout: undefined;
  OrdersList: undefined;
  OrderDetail: {
    orderId: string;
  };
  AddressList: undefined;
  AddressForm: {
    addressId?: string;
    isEditing?: boolean;
  };
  Profile: undefined;
  Settings: undefined;
  Wishlist: undefined;
  Notifications: undefined;
};

// Root Stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
  Loading: undefined;
};

// Screen Props Types
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type HomeTabScreenProps<T extends keyof HomeTabParamList> = BottomTabScreenProps<
  HomeTabParamList,
  T
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
  MainStackParamList,
  T
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Combined Props for nested navigators
export type HomeScreenProps = HomeTabScreenProps<'Home'>;
export type CategoriesScreenProps = HomeTabScreenProps<'Categories'>;
export type CartScreenProps = HomeTabScreenProps<'Cart'>;
export type AccountScreenProps = HomeTabScreenProps<'Account'>;

export type ProductDetailScreenProps = MainStackScreenProps<'ProductDetail'>;
export type ProductListScreenProps = MainStackScreenProps<'ProductList'>;
export type SearchScreenProps = MainStackScreenProps<'Search'>;
export type CheckoutScreenProps = MainStackScreenProps<'Checkout'>;
export type OrderDetailScreenProps = MainStackScreenProps<'OrderDetail'>;
export type AddressListScreenProps = MainStackScreenProps<'AddressList'>;
export type AddressFormScreenProps = MainStackScreenProps<'AddressForm'>;

export type PhoneLoginScreenProps = AuthStackScreenProps<'PhoneLogin'>;
export type EmailLoginScreenProps = AuthStackScreenProps<'EmailLogin'>;
export type OtpVerifyScreenProps = AuthStackScreenProps<'OtpVerify'>;

// Declare global types for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}