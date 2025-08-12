'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeMap: Record<string, string> = {
  '': 'Dashboard',
  'catalog': 'Catalog',
  'categories': 'Categories',
  'brands': 'Brands',
  'products': 'Products',
  'orders': 'Orders',
  'sellers': 'Sellers',
  'customers': 'Customers',
  'promotions': 'Promotions',
  'coupons': 'Coupons',
  'banners': 'Banners',
  'fulfillment': 'Fulfillment',
  'returns': 'Returns',
  'shipments': 'Shipments',
  'finance': 'Finance',
  'settlements': 'Settlements',
  'invoices': 'Invoices',
  'cms': 'CMS',
  'pages': 'Pages',
  'settings': 'Settings',
  'feature-flags': 'Feature Flags',
  'integrations': 'Integrations',
  'users': 'Users',
  'new': 'New',
  'edit': 'Edit',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === '/') {
      return [{ label: 'Dashboard' }];
    }
    
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/' }
    ];
    
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Check if it's a dynamic route (like [id])
      const isId = /^[a-f\d]{24}$|^\d+$/.test(segment);
      
      if (isId) {
        // For ID segments, use a generic label or try to get from context
        const parentSegment = segments[index - 1];
        if (parentSegment === 'products') {
          breadcrumbs.push({ label: `Product Details` });
        } else if (parentSegment === 'orders') {
          breadcrumbs.push({ label: `Order #${segment.slice(-6)}` });
        } else if (parentSegment === 'sellers') {
          breadcrumbs.push({ label: `Seller Details` });
        } else if (parentSegment === 'customers') {
          breadcrumbs.push({ label: `Customer Details` });
        } else {
          breadcrumbs.push({ label: `Details` });
        }
      } else {
        const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        
        // Don't add href for the last segment (current page)
        const href = index === segments.length - 1 ? undefined : currentPath;
        
        breadcrumbs.push({ label, href });
      }
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumb for dashboard
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
              )}
              
              {index === 0 && (
                <Home className="h-4 w-4 text-gray-400 mr-2" />
              )}
              
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}