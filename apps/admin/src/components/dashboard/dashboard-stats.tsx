'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Card, Badge } from '@tradygo/ui';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, changeLabel, icon, trend }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
            {getTrendIcon()}
            <span className="font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function DashboardStats() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: 'Total Revenue (GMV)',
      value: formatCurrency(2847392),
      change: 12.5,
      changeLabel: 'from last month',
      icon: <DollarSign className="h-8 w-8" />,
      trend: 'up' as const
    },
    {
      title: 'Total Orders',
      value: formatNumber(18749),
      change: 8.2,
      changeLabel: 'from last month',
      icon: <ShoppingCart className="h-8 w-8" />,
      trend: 'up' as const
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(152),
      change: -2.1,
      changeLabel: 'from last month',
      icon: <TrendingUp className="h-8 w-8" />,
      trend: 'down' as const
    },
    {
      title: 'Active Customers',
      value: formatNumber(12847),
      change: 15.3,
      changeLabel: 'from last month',
      icon: <Users className="h-8 w-8" />,
      trend: 'up' as const
    },
    {
      title: 'Total Products',
      value: formatNumber(45892),
      change: 5.7,
      changeLabel: 'from last month',
      icon: <Package className="h-8 w-8" />,
      trend: 'up' as const
    },
    {
      title: 'Active Sellers',
      value: formatNumber(847),
      change: 3.2,
      changeLabel: 'from last month',
      icon: <Users className="h-8 w-8" />,
      trend: 'up' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Last 30 days</Badge>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}