'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCheck,
  Megaphone,
  Truck,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Tag,
  BarChart3,
  FileText,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@tradygo/ui';
import { cn } from '@/lib/utils';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@tradygo/ui';

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string;
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Catalog',
    icon: Package,
    children: [
      { title: 'Categories', href: '/catalog/categories', icon: Tag },
      { title: 'Brands', href: '/catalog/brands', icon: Store },
      { title: 'Products', href: '/catalog/products', icon: Package },
      { title: 'Variants', href: '/catalog/variants', icon: Package },
    ],
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
    badge: '12',
  },
  {
    title: 'Sellers',
    icon: UserCheck,
    children: [
      { title: 'Onboarding', href: '/sellers/onboarding', icon: UserCheck, badge: '5' },
      { title: 'Active Sellers', href: '/sellers/active', icon: Users },
      { title: 'Payouts', href: '/sellers/payouts', icon: CreditCard },
      { title: 'Violations', href: '/sellers/violations', icon: Shield },
    ],
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Promotions',
    icon: Megaphone,
    children: [
      { title: 'Coupons', href: '/promotions/coupons', icon: Tag },
      { title: 'Banners', href: '/promotions/banners', icon: FileText },
      { title: 'Home Sections', href: '/promotions/home-sections', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Fulfillment',
    icon: Truck,
    children: [
      { title: 'Shipments', href: '/fulfillment/shipments', icon: Truck },
      { title: 'Returns', href: '/fulfillment/returns', icon: Package },
      { title: 'RTO', href: '/fulfillment/rto', icon: Package },
    ],
  },
  {
    title: 'Finance',
    icon: CreditCard,
    children: [
      { title: 'Settlements', href: '/finance/settlements', icon: CreditCard },
      { title: 'Invoices', href: '/finance/invoices', icon: FileText },
      { title: 'Taxes', href: '/finance/taxes', icon: BarChart3 },
      { title: 'Refunds', href: '/finance/refunds', icon: CreditCard },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Roles & Permissions', href: '/settings/roles', icon: Shield },
      { title: 'Webhooks', href: '/settings/webhooks', icon: Zap },
      { title: 'Integrations', href: '/settings/integrations', icon: Settings },
      { title: 'Feature Flags', href: '/settings/features', icon: Zap },
      { title: 'Content Pages', href: '/settings/content', icon: FileText },
    ],
  },
];

function NavItemComponent({ item, collapsed, level = 0 }: { item: NavItem; collapsed: boolean; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const hasActiveChild = hasChildren && item.children?.some(child => pathname === child.href);

  React.useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  if (hasChildren) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start h-10 px-3',
            level > 0 && 'ml-4',
            (isActive || hasActiveChild) && 'bg-accent text-accent-foreground',
            collapsed && 'px-2'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <item.icon className={cn('h-4 w-4', collapsed ? 'mr-0' : 'mr-2')} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className={cn('h-4 w-4 ml-1 transition-transform', isOpen && 'rotate-90')} />
            </>
          )}
        </Button>
        {!collapsed && isOpen && (
          <div className="space-y-1">
            {item.children?.map((child) => (
              <NavItemComponent key={child.title} item={child} collapsed={collapsed} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start h-10 px-3',
        level > 0 && 'ml-4',
        isActive && 'bg-accent text-accent-foreground',
        collapsed && 'px-2'
      )}
      asChild
    >
      <Link href={item.href!}>
        <item.icon className={cn('h-4 w-4', collapsed ? 'mr-0' : 'mr-2')} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    </Button>
  );
}

export function AdminSidebar({ collapsed, onCollapsedChange }: AdminSidebarProps) {
  return (
    <div className={cn(
      'admin-sidebar flex flex-col border-r transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-lg">TradyGo</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapsedChange(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavItemComponent key={item.title} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@tradygo.in</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mx-auto">
            <span className="text-sm font-medium">AD</span>
          </div>
        )}
      </div>
    </div>
  );
}