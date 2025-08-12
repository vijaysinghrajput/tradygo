'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/products/new': 'New Product',
  '/products/[id]': 'Product Details',
  '/products/[id]/edit': 'Edit Product',
  '/inventory': 'Inventory',
  '/orders': 'Orders',
  '/orders/[id]': 'Order Details',
  '/returns': 'Returns & Exchanges',
  '/returns/[id]': 'Return Details',
  '/payouts': 'Payouts',
  '/payouts/statements': 'Payout Statements',
  '/support': 'Support',
  '/support/tickets': 'Support Tickets',
  '/support/tickets/[id]': 'Ticket Details',
  '/support/faqs': 'FAQs',
  '/onboarding': 'Onboarding',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/' },
  ];

  if (segments.length === 0) {
    return [{ label: 'Dashboard' }];
  }

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Check if segment is a dynamic route (UUID or number)
    const isDynamic = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\d+$/.test(segment);
    
    let label = routeLabels[currentPath];
    
    if (!label && isDynamic) {
      // For dynamic routes, use the parent route label with ID
      const parentPath = currentPath.replace(`/${segment}`, '/[id]');
      label = routeLabels[parentPath] || segment;
    }
    
    if (!label) {
      // Fallback: capitalize the segment
      label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    }

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}