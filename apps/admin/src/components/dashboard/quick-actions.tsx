'use client';

import Link from 'next/link';
import { Button } from '@tradygo/ui';
import { Plus, Package, Users, Tag, FileText } from 'lucide-react';

const quickActions = [
  {
    label: 'Add Product',
    href: '/catalog/products/new',
    icon: Package,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'New Coupon',
    href: '/promotions/coupons/new',
    icon: Tag,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Add Seller',
    href: '/sellers/new',
    icon: Users,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    label: 'Create Banner',
    href: '/promotions/banners/new',
    icon: FileText,
    color: 'bg-orange-500 hover:bg-orange-600',
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
            className={`${action.color} text-white border-0`}
          >
            <Link href={action.href} className="flex items-center space-x-1">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}