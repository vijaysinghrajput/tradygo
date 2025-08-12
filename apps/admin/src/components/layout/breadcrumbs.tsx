'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Route mapping for automatic breadcrumb generation
const routeMap: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/catalog': 'Catalog',
  '/catalog/categories': 'Categories',
  '/catalog/brands': 'Brands',
  '/catalog/products': 'Products',
  '/catalog/variants': 'Variants',
  '/orders': 'Orders',
  '/sellers': 'Sellers',
  '/sellers/onboarding': 'Onboarding',
  '/sellers/active': 'Active Sellers',
  '/sellers/payouts': 'Payouts',
  '/sellers/violations': 'Violations',
  '/customers': 'Customers',
  '/promotions': 'Promotions',
  '/promotions/coupons': 'Coupons',
  '/promotions/banners': 'Banners',
  '/promotions/sections': 'Home Sections',
  '/fulfillment': 'Fulfillment',
  '/fulfillment/shipments': 'Shipments',
  '/fulfillment/rto': 'RTO',
  '/fulfillment/returns': 'Returns & Exchanges',
  '/finance': 'Finance',
  '/finance/settlements': 'Settlements',
  '/finance/invoices': 'Invoices',
  '/finance/taxes': 'Taxes',
  '/finance/refunds': 'Refunds',
  '/settings': 'Settings',
  '/settings/roles': 'Roles & Permissions',
  '/settings/webhooks': 'Webhooks',
  '/settings/integrations': 'Integrations',
  '/settings/features': 'Feature Flags',
  '/settings/content': 'Content Pages',
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/' }
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label,
      href: currentPath
    });
  }

  return breadcrumbs;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <Home className="h-4 w-4" />
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        return (
          <div key={item.href || item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {isLast || !item.href ? (
              <span className={cn(
                'font-medium',
                isLast ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}