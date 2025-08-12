'use client';

import Link from 'next/link';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Card, Badge, Button, Avatar } from '@tradygo/ui';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  createdAt: string;
  seller: string;
}

function getStatusColor(status: Order['status']) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function RecentOrders() {
  // Mock data - in real app, this would come from API
  const orders: Order[] = [
    {
      id: 'ORD-12345',
      customer: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      total: 299.99,
      status: 'confirmed',
      items: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      seller: 'TechStore'
    },
    {
      id: 'ORD-12344',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      total: 149.50,
      status: 'shipped',
      items: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      seller: 'FashionHub'
    },
    {
      id: 'ORD-12343',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com'
      },
      total: 89.99,
      status: 'pending',
      items: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      seller: 'BookWorld'
    },
    {
      id: 'ORD-12342',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com'
      },
      total: 459.99,
      status: 'delivered',
      items: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      seller: 'ElectroMart'
    },
    {
      id: 'ORD-12341',
      customer: {
        name: 'David Brown',
        email: 'david@example.com'
      },
      total: 199.99,
      status: 'cancelled',
      items: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      seller: 'SportZone'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <Link href="/orders">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                  {order.customer.name.split(' ').map(n => n[0]).join('')}
                </div>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                    {order.id}
                  </Link>
                  <Badge className={cn('text-xs', getStatusColor(order.status))}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.customer.name} • {order.seller} • {order.items} item{order.items > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatRelativeTime(order.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(order.total)}</div>
              </div>
              
              <div className="flex items-center gap-1">
                <Link href={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recent orders found</p>
        </div>
      )}
    </Card>
  );
}