import { LucideIcon } from 'lucide-react';
import {
  Home,
  Search,
  ShoppingBag,
  User,
  Heart,
  ShoppingCart,
  Package,
  Settings,
  HelpCircle,
  Phone,
  Info,
  FileText,
  Shield,
  Truck,
  CreditCard,
  Gift,
  Star,
  Tag,
  Zap,
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  roles?: ('CUSTOMER' | 'SELLER' | 'ADMIN')[];
  children?: NavigationItem[];
  external?: boolean;
  badge?: string;
}

// Main navigation for header
export const mainNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    id: 'categories',
    label: 'Categories',
    href: '/categories',
    children: [
      {
        id: 'electronics',
        label: 'Electronics',
        href: '/categories/electronics',
        icon: Zap,
      },
      {
        id: 'fashion',
        label: 'Fashion',
        href: '/categories/fashion',
        icon: ShoppingBag,
      },
      {
        id: 'books',
        label: 'Books',
        href: '/categories/books',
        icon: FileText,
      },
      {
        id: 'home-garden',
        label: 'Home & Garden',
        href: '/categories/home-garden',
        icon: Home,
      },
    ],
  },
  {
    id: 'deals',
    label: 'Deals',
    href: '/deals',
    icon: Tag,
    badge: 'Hot',
  },
  {
    id: 'brands',
    label: 'Brands',
    href: '/brands',
  },
];

// User account navigation
export const accountNavigation: NavigationItem[] = [
  {
    id: 'profile',
    label: 'My Profile',
    href: '/account/profile',
    icon: User,
    roles: ['CUSTOMER'],
  },
  {
    id: 'orders',
    label: 'My Orders',
    href: '/account/orders',
    icon: Package,
    roles: ['CUSTOMER'],
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
    roles: ['CUSTOMER'],
  },
  {
    id: 'addresses',
    label: 'Addresses',
    href: '/account/addresses',
    icon: Truck,
    roles: ['CUSTOMER'],
  },
  {
    id: 'payments',
    label: 'Payment Methods',
    href: '/account/payments',
    icon: CreditCard,
    roles: ['CUSTOMER'],
  },
  {
    id: 'coupons',
    label: 'My Coupons',
    href: '/account/coupons',
    icon: Gift,
    roles: ['CUSTOMER'],
  },
  {
    id: 'reviews',
    label: 'My Reviews',
    href: '/account/reviews',
    icon: Star,
    roles: ['CUSTOMER'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/account/settings',
    icon: Settings,
    roles: ['CUSTOMER'],
  },
];

// Mobile bottom navigation
export const mobileNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    id: 'search',
    label: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    id: 'cart',
    label: 'Cart',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    id: 'account',
    label: 'Account',
    href: '/account',
    icon: User,
    roles: ['CUSTOMER'],
  },
];

// Footer navigation
export const footerNavigation = {
  company: {
    title: 'Company',
    items: [
      {
        id: 'about',
        label: 'About Us',
        href: '/about',
        icon: Info,
      },
      {
        id: 'careers',
        label: 'Careers',
        href: '/careers',
      },
      {
        id: 'press',
        label: 'Press',
        href: '/press',
      },
      {
        id: 'blog',
        label: 'Blog',
        href: '/blog',
      },
    ],
  },
  support: {
    title: 'Support',
    items: [
      {
        id: 'help',
        label: 'Help Center',
        href: '/help',
        icon: HelpCircle,
      },
      {
        id: 'contact',
        label: 'Contact Us',
        href: '/contact',
        icon: Phone,
      },
      {
        id: 'shipping',
        label: 'Shipping Info',
        href: '/shipping',
        icon: Truck,
      },
      {
        id: 'returns',
        label: 'Returns',
        href: '/returns',
      },
    ],
  },
  legal: {
    title: 'Legal',
    items: [
      {
        id: 'privacy',
        label: 'Privacy Policy',
        href: '/privacy',
        icon: Shield,
      },
      {
        id: 'terms',
        label: 'Terms of Service',
        href: '/terms',
        icon: FileText,
      },
      {
        id: 'cookies',
        label: 'Cookie Policy',
        href: '/cookies',
      },
    ],
  },
};

// Helper function to filter navigation by user role
export function filterNavigationByRole(
  navigation: NavigationItem[],
  userRole?: 'CUSTOMER' | 'SELLER' | 'ADMIN'
): NavigationItem[] {
  return navigation.filter((item) => {
    if (!item.roles) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole);
  });
}

// Helper function to get navigation item by ID
export function getNavigationItem(
  navigation: NavigationItem[],
  id: string
): NavigationItem | undefined {
  for (const item of navigation) {
    if (item.id === id) return item;
    if (item.children) {
      const found = getNavigationItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}