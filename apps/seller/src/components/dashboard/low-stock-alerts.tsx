'use client';

import Link from 'next/link';
import { AlertTriangle, Package, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@tradygo/ui';
import { formatNumber } from '@/lib/utils';

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  image: string;
  category: string;
}

// Mock data for low stock items
const lowStockItems: LowStockItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    sku: 'IPH-15-PM-256',
    currentStock: 2,
    minStock: 10,
    image: '/placeholder-product.jpg',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    sku: 'SAM-S24-128',
    currentStock: 1,
    minStock: 8,
    image: '/placeholder-product.jpg',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    sku: 'MBA-M3-512',
    currentStock: 0,
    minStock: 5,
    image: '/placeholder-product.jpg',
    category: 'Computers',
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    sku: 'APP-2-USB',
    currentStock: 3,
    minStock: 15,
    image: '/placeholder-product.jpg',
    category: 'Audio',
  },
  {
    id: '5',
    name: 'iPad Pro 12.9"',
    sku: 'IPD-PRO-129',
    currentStock: 1,
    minStock: 6,
    image: '/placeholder-product.jpg',
    category: 'Tablets',
  },
];

function getStockStatus(currentStock: number, minStock: number) {
  if (currentStock === 0) {
    return { label: 'Out of Stock', variant: 'destructive' as const, priority: 3 };
  } else if (currentStock <= minStock * 0.3) {
    return { label: 'Critical', variant: 'destructive' as const, priority: 2 };
  } else if (currentStock <= minStock * 0.6) {
    return { label: 'Low', variant: 'secondary' as const, priority: 1 };
  }
  return { label: 'Normal', variant: 'default' as const, priority: 0 };
}

export function LowStockAlerts() {
  // Sort by priority (highest first) and then by current stock (lowest first)
  const sortedItems = [...lowStockItems].sort((a, b) => {
    const aStatus = getStockStatus(a.currentStock, a.minStock);
    const bStatus = getStockStatus(b.currentStock, b.minStock);
    
    if (aStatus.priority !== bStatus.priority) {
      return bStatus.priority - aStatus.priority;
    }
    
    return a.currentStock - b.currentStock;
  });

  const criticalCount = lowStockItems.filter(item => {
    const status = getStockStatus(item.currentStock, item.minStock);
    return status.priority >= 2;
  }).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle>Low Stock Alerts</CardTitle>
            {criticalCount > 0 && (
              <Badge variant="destructive">{criticalCount}</Badge>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/inventory">
              View All
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedItems.slice(0, 5).map((item) => {
            const status = getStockStatus(item.currentStock, item.minStock);
            
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Stock: <span className="font-medium text-foreground">{formatNumber(item.currentStock)}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Min: <span className="font-medium text-foreground">{formatNumber(item.minStock)}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/inventory?sku=${item.sku}`}>
                      Restock
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
          
          {lowStockItems.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No low stock alerts</p>
              <p className="text-xs text-muted-foreground mt-1">
                All products are well stocked
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}