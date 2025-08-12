'use client';

import Link from 'next/link';
import { ShoppingCart, ExternalLink, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@tradygo/ui';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  shippingAddress: {
    city: string;
    state: string;
  };
}

// Mock data for recent orders
const recentOrders: RecentOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh@example.com',
    items: 2,
    total: 89750,
    status: 'processing',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    shippingAddress: {
      city: 'Mumbai',
      state: 'Maharashtra',
    },
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    items: 1,
    total: 24999,
    status: 'shipped',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    shippingAddress: {
      city: 'Delhi',
      state: 'Delhi',
    },
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Amit Patel',
    customerEmail: 'amit@example.com',
    items: 3,
    total: 156780,
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    shippingAddress: {
      city: 'Bangalore',
      state: 'Karnataka',
    },
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha@example.com',
    items: 1,
    total: 45600,
    status: 'delivered',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    shippingAddress: {
      city: 'Hyderabad',
      state: 'Telangana',
    },
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@example.com',
    items: 2,
    total: 78900,
    status: 'processing',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    shippingAddress: {
      city: 'Pune',
      state: 'Maharashtra',
    },
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customerName: 'Anita Gupta',
    customerEmail: 'anita@example.com',
    items: 1,
    total: 12500,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    shippingAddress: {
      city: 'Chennai',
      state: 'Tamil Nadu',
    },
  },
];

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return <Package className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

function getStatusVariant(status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'default';
    case 'shipped':
      return 'outline';
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function RecentOrders() {
  const totalOrders = recentOrders.length;
  const totalValue = recentOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <CardTitle>Recent Orders</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              View All
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Total Orders: <span className="font-medium text-foreground">{totalOrders}</span>
          </span>
          <span>
            Total Value: <span className="font-medium text-foreground">{formatCurrency(totalValue)}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-4 rounded-lg border">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <Badge variant={getStatusVariant(order.status)} className="text-xs capitalize">
                    {order.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {order.customerName} • {order.items} item{order.items > 1 ? 's' : ''}
                </p>
                
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href={`/orders/${order.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          
          {recentOrders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No recent orders</p>
              <p className="text-xs text-muted-foreground mt-1">
                Orders will appear here once customers start purchasing
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}