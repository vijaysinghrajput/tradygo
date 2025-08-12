'use client';

import Link from 'next/link';
import { TrendingUp, Package, ExternalLink, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@tradygo/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface BestSellerItem {
  id: string;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: number;
  growth: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

// Mock data for best selling products
const bestSellers: BestSellerItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    sku: 'IPH-15-P-128',
    unitsSold: 156,
    revenue: 124800,
    growth: 23.5,
    image: '/placeholder-product.jpg',
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 342,
  },
  {
    id: '2',
    name: 'AirPods Pro 2',
    sku: 'APP-2-USB',
    unitsSold: 89,
    revenue: 22250,
    growth: 18.2,
    image: '/placeholder-product.jpg',
    category: 'Audio',
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    sku: 'MBA-M3-256',
    unitsSold: 45,
    revenue: 54000,
    growth: 15.8,
    image: '/placeholder-product.jpg',
    category: 'Computers',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: '4',
    name: 'iPad Air',
    sku: 'IPA-AIR-64',
    unitsSold: 67,
    revenue: 40200,
    growth: 12.3,
    image: '/placeholder-product.jpg',
    category: 'Tablets',
    rating: 4.6,
    reviewCount: 234,
  },
  {
    id: '5',
    name: 'Apple Watch Series 9',
    sku: 'AWS-9-45',
    unitsSold: 78,
    revenue: 31200,
    growth: 9.7,
    image: '/placeholder-product.jpg',
    category: 'Wearables',
    rating: 4.5,
    reviewCount: 167,
  },
];

export function BestSellers() {
  const totalRevenue = bestSellers.reduce((sum, item) => sum + item.revenue, 0);
  const totalUnitsSold = bestSellers.reduce((sum, item) => sum + item.unitsSold, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <CardTitle>Best Sellers</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products?sort=best-selling">
              View All
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Total Units: <span className="font-medium text-foreground">{formatNumber(totalUnitsSold)}</span>
          </span>
          <span>
            Revenue: <span className="font-medium text-foreground">{formatCurrency(totalRevenue)}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bestSellers.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    +{item.growth}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
                
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Sold: <span className="font-medium text-foreground">{formatNumber(item.unitsSold)}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Revenue: <span className="font-medium text-foreground">{formatCurrency(item.revenue)}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {item.rating} ({formatNumber(item.reviewCount)} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/products/${item.id}`}>
                    View
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          
          {bestSellers.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No sales data available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start selling to see your best performers
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}