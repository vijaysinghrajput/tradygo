'use client';

import Link from 'next/link';
import { TrendingUp, Package } from 'lucide-react';
import { Card, Badge, Progress } from '@tradygo/ui';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  products: number;
  growth: number;
  marketShare: number;
}

export function TopCategories() {
  // Mock data - in real app, this would come from API
  const categories: Category[] = [
    {
      id: '1',
      name: 'Electronics',
      revenue: 847392,
      orders: 3247,
      products: 12847,
      growth: 15.2,
      marketShare: 32.5
    },
    {
      id: '2',
      name: 'Fashion & Apparel',
      revenue: 623847,
      orders: 5892,
      products: 8934,
      growth: 8.7,
      marketShare: 24.1
    },
    {
      id: '3',
      name: 'Home & Garden',
      revenue: 456789,
      orders: 2134,
      products: 6789,
      growth: 12.3,
      marketShare: 18.2
    },
    {
      id: '4',
      name: 'Sports & Outdoors',
      revenue: 298456,
      orders: 1876,
      products: 4567,
      growth: -2.1,
      marketShare: 11.8
    },
    {
      id: '5',
      name: 'Books & Media',
      revenue: 187234,
      orders: 3456,
      products: 9876,
      growth: 5.4,
      marketShare: 7.4
    },
    {
      id: '6',
      name: 'Health & Beauty',
      revenue: 156789,
      orders: 2987,
      products: 3456,
      growth: 18.9,
      marketShare: 6.0
    }
  ];

  const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Top Categories</h3>
        <Link href="/catalog/categories" className="text-sm text-primary hover:underline">
          View All Categories
        </Link>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <Link href={`/catalog/categories/${category.id}`} className="font-medium hover:underline">
                    {category.name}
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{formatNumber(category.orders)} orders</span>
                    <span>{formatNumber(category.products)} products</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(category.revenue)}</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className={`h-3 w-3 ${
                    category.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={category.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {category.growth > 0 ? '+' : ''}{category.growth}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Market Share</span>
                <span className="font-medium">{category.marketShare}%</span>
              </div>
              <Progress value={category.marketShare} className="h-2" />
            </div>
            
            {index < categories.length - 1 && <div className="border-t" />}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Revenue</span>
          <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>
    </Card>
  );
}