'use client';

import Link from 'next/link';
import { Star, TrendingUp, Store } from 'lucide-react';
import { Card, Badge, Avatar } from '@tradygo/ui';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface Seller {
  id: string;
  name: string;
  logo?: string;
  revenue: number;
  orders: number;
  products: number;
  rating: number;
  growth: number;
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
}

function getStatusColor(status: Seller['status']) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function TopSellers() {
  // Mock data - in real app, this would come from API
  const sellers: Seller[] = [
    {
      id: '1',
      name: 'TechStore Pro',
      revenue: 284739,
      orders: 1247,
      products: 456,
      rating: 4.8,
      growth: 23.5,
      status: 'active',
      joinedAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'FashionHub Elite',
      revenue: 198456,
      orders: 2134,
      products: 789,
      rating: 4.6,
      growth: 18.2,
      status: 'active',
      joinedAt: '2023-02-20'
    },
    {
      id: '3',
      name: 'ElectroMart',
      revenue: 156789,
      orders: 987,
      products: 234,
      rating: 4.9,
      growth: 15.7,
      status: 'active',
      joinedAt: '2023-03-10'
    },
    {
      id: '4',
      name: 'BookWorld',
      revenue: 123456,
      orders: 1876,
      products: 1234,
      rating: 4.4,
      growth: 8.9,
      status: 'active',
      joinedAt: '2023-01-05'
    },
    {
      id: '5',
      name: 'SportZone',
      revenue: 98765,
      orders: 654,
      products: 345,
      rating: 4.7,
      growth: -2.1,
      status: 'pending',
      joinedAt: '2023-04-12'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Top Sellers</h3>
        <Link href="/sellers" className="text-sm text-primary hover:underline">
          View All Sellers
        </Link>
      </div>

      <div className="space-y-4">
        {sellers.map((seller, index) => (
          <div key={seller.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                #{index + 1}
              </div>
              
              <Avatar className="h-10 w-10">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <Store className="h-5 w-5" />
                </div>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link href={`/sellers/${seller.id}`} className="font-medium hover:underline">
                    {seller.name}
                  </Link>
                  <Badge className={cn('text-xs', getStatusColor(seller.status))}>
                    {seller.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatNumber(seller.orders)} orders</span>
                  <span>{formatNumber(seller.products)} products</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{seller.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-semibold">{formatCurrency(seller.revenue)}</div>
              <div className="flex items-center gap-1 text-sm justify-end">
                <TrendingUp className={`h-3 w-3 ${
                  seller.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className={seller.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {seller.growth > 0 ? '+' : ''}{seller.growth}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{sellers.length}</div>
            <div className="text-sm text-muted-foreground">Active Sellers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(sellers.reduce((sum, s) => sum + s.orders, 0))}
            </div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(sellers.reduce((sum, s) => sum + s.revenue, 0))}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
        </div>
      </div>
    </Card>
  );
}