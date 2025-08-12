'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@tradygo/ui';
import { formatCurrency } from '@/lib/utils';

type Period = '7d' | '30d' | '90d';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

// Mock data for different periods
const salesData: Record<Period, SalesData[]> = {
  '7d': [
    { date: 'Mon', sales: 12450, orders: 23 },
    { date: 'Tue', sales: 15230, orders: 28 },
    { date: 'Wed', sales: 9870, orders: 18 },
    { date: 'Thu', sales: 18650, orders: 34 },
    { date: 'Fri', sales: 22340, orders: 41 },
    { date: 'Sat', sales: 28900, orders: 52 },
    { date: 'Sun', sales: 19750, orders: 36 },
  ],
  '30d': [
    { date: 'Week 1', sales: 89750, orders: 156 },
    { date: 'Week 2', sales: 95420, orders: 168 },
    { date: 'Week 3', sales: 87650, orders: 142 },
    { date: 'Week 4', sales: 102340, orders: 189 },
  ],
  '90d': [
    { date: 'Month 1', sales: 345600, orders: 678 },
    { date: 'Month 2', sales: 398750, orders: 742 },
    { date: 'Month 3', sales: 421890, orders: 823 },
  ],
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Sales' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart() {
  const [period, setPeriod] = useState<Period>('7d');
  const data = salesData[period];

  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-sm text-muted-foreground">
                Total Sales: <span className="font-medium text-foreground">{formatCurrency(totalSales)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total Orders: <span className="font-medium text-foreground">{totalOrders}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as Period[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                name="Sales"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}