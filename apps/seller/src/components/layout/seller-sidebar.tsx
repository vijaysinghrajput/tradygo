'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  RotateCcw,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Store,
  X,
} from 'lucide-react';
import { Button } from '@tradygo/ui';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Products',
    href: '/products',
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: <Warehouse className="h-5 w-5" />,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
    badge: '12',
  },
  {
    title: 'Returns',
    href: '/returns',
    icon: <RotateCcw className="h-5 w-5" />,
    badge: '3',
  },
  {
    title: 'Payouts',
    href: '/payouts',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: 'Support',
    href: '/support',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

interface SellerSidebarProps {
  open: boolean;
  collapsed: boolean;
  onOpenChange: (open: boolean) => void;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function SellerSidebar({
  open,
  collapsed,
  onOpenChange,
  onCollapsedChange,
}: SellerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-background border-r border-border transition-all duration-300 ease-in-out seller-sidebar',
          'hidden lg:block',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">TradyGo</span>
            </div>
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
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
                title={collapsed ? item.title : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out seller-sidebar',
          'lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TradyGo</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.icon}
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}