import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList, HomeTabParamList } from './types';
import { colors } from '@/theme';

// Import tab screens
import HomeScreen from '@/screens/Home/HomeScreen';
import CategoriesScreen from '@/screens/Categories/CategoriesScreen';
import SearchScreen from '@/screens/Search/SearchScreen';
import CartScreen from '@/screens/Cart/CartScreen';
import AccountScreen from '@/screens/Account/AccountScreen';

// Import other screens
import ProductDetailScreen from '@/screens/Product/ProductDetailScreen';
import ProductListScreen from '@/screens/Product/ProductListScreen';
import CheckoutScreen from '@/screens/Checkout/CheckoutScreen';
import OrderDetailScreen from '@/screens/Order/OrderDetailScreen';
import OrdersListScreen from '@/screens/Order/OrdersListScreen';
import AddressListScreen from '@/screens/Address/AddressListScreen';
import AddressFormScreen from '@/screens/Address/AddressFormScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';

// Import icons (placeholder - you'll need to add actual icon components)
const HomeIcon = () => null;
const CategoriesIcon = () => null;
const SearchIcon = () => null;
const CartIcon = () => null;
const AccountIcon = () => null;

const Tab = createBottomTabNavigator<HomeTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Bottom Tab Navigator
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.neutral.gray500,
        tabBarStyle: {
          backgroundColor: colors.background.paper,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
          tabBarIcon: CategoriesIcon,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: SearchIcon,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarIcon: CartIcon,
          tabBarBadge: undefined, // You can add cart count here
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Account',
          tabBarIcon: AccountIcon,
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background.paper,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={({ route }) => ({
          title: route.params?.categoryName || 'Products',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
          headerBackTitleVisible: false,
          gestureEnabled: false, // Prevent accidental back navigation during checkout
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: 'Order Details',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="OrdersList"
        component={OrdersListScreen}
        options={{
          title: 'My Orders',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{
          title: 'My Addresses',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={({ route }) => ({
          title: route.params?.addressId ? 'Edit Address' : 'Add Address',
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;