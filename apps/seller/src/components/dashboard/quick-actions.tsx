'use client';

import Link from 'next/link';
import { Button } from '@tradygo/ui';
import { Plus, Package, Upload, ShoppingCart, BarChart3, FileText } from 'lucide-react';

const quickActions = [
  {
    label: 'Add Product',
    href: '/products/new',
    icon: Package,
    color: 'bg-blue-500 hover:bg-blue-600',
    description: 'Create new product',
  },
  {
    label: 'Bulk Upload',
    href: '/inventory/bulk',
    icon: Upload,
    color: 'bg-green-500 hover:bg-green-600',
    description: 'Upload inventory CSV',
  },
  {
    label: 'View Orders',
    href: '/orders',
    icon: ShoppingCart,
    color: 'bg-purple-500 hover:bg-purple-600',
    description: 'Manage orders',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    color: 'bg-orange-500 hover:bg-orange-600',
    description: 'View reports',
  },
];

export function QuickActions() {
  return (
    <div className="flex items-center space-x-2">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.label}
            asChild
            size="sm"
            className={`${action.color} text-white border-0 hidden sm:flex`}
            title={action.description}
          >
            <Link href={action.href} className="flex items-center space-x-1">
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{action.label}</span>
            </Link>
          </Button>
        );
      })}
      
      {/* Mobile dropdown for quick actions */}
      <div className="sm:hidden">
        <Button size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}