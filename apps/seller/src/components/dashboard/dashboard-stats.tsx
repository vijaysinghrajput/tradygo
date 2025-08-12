'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@tradygo/ui';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  period: string;
}

function StatCard({ title, value, change, trend, icon, period }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === 'up' ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {formatPercentage(Math.abs(change))}
          </span>
          <span className="ml-1">from {period}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  // Mock data - in real app, this would come from API
  const stats = {
    today: {
      sales: 12450,
      orders: 23,
      avgOrderValue: 541.30,
      customers: 18,
    },
    sevenDays: {
      sales: 89750,
      orders: 156,
      avgOrderValue: 575.32,
      customers: 142,
    },
    thirtyDays: {
      sales: 345600,
      orders: 678,
      avgOrderValue: 509.73,
      customers: 523,
    },
  };

  const changes = {
    sales: 12.5,
    orders: 8.2,
    avgOrderValue: -3.1,
    customers: 15.7,
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated: 2 minutes ago</span>
        </div>
      </div>

      {/* Today's Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Today</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Sales"
            value={formatCurrency(stats.today.sales)}
            change={changes.sales}
            trend="up"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            period="yesterday"
          />
          <StatCard
            title="Orders"
            value={formatNumber(stats.today.orders)}
            change={changes.orders}
            trend="up"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            period="yesterday"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(stats.today.avgOrderValue)}
            change={changes.avgOrderValue}
            trend="down"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            period="yesterday"
          />
          <StatCard
            title="Customers"
            value={formatNumber(stats.today.customers)}
            change={changes.customers}
            trend="up"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            period="yesterday"
          />
        </div>
      </div>

      {/* 7 Days Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Last 7 Days</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Sales"
            value={formatCurrency(stats.sevenDays.sales)}
            change={changes.sales}
            trend="up"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            period="previous week"
          />
          <StatCard
            title="Orders"
            value={formatNumber(stats.sevenDays.orders)}
            change={changes.orders}
            trend="up"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            period="previous week"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(stats.sevenDays.avgOrderValue)}
            change={changes.avgOrderValue}
            trend="down"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            period="previous week"
          />
          <StatCard
            title="Customers"
            value={formatNumber(stats.sevenDays.customers)}
            change={changes.customers}
            trend="up"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            period="previous week"
          />
        </div>
      </div>

      {/* 30 Days Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Last 30 Days</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Sales"
            value={formatCurrency(stats.thirtyDays.sales)}
            change={changes.sales}
            trend="up"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            period="previous month"
          />
          <StatCard
            title="Orders"
            value={formatNumber(stats.thirtyDays.orders)}
            change={changes.orders}
            trend="up"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            period="previous month"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(stats.thirtyDays.avgOrderValue)}
            change={changes.avgOrderValue}
            trend="down"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            period="previous month"
          />
          <StatCard
            title="Customers"
            value={formatNumber(stats.thirtyDays.customers)}
            change={changes.customers}
            trend="up"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            period="previous month"
          />
        </div>
      </div>
    </div>
  );
}