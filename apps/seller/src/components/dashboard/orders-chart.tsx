'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@tradygo/ui';
import { formatNumber } from '@/lib/utils';

type ChartType = 'bar' | 'pie';

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface OrderTrendData {
  date: string;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// Mock data for order status
const orderStatusData: OrderStatusData[] = [
  { status: 'Pending', count: 23, color: '#f59e0b' },
  { status: 'Processing', count: 45, color: '#3b82f6' },
  { status: 'Shipped', count: 67, color: '#8b5cf6' },
  { status: 'Delivered', count: 156, color: '#10b981' },
  { status: 'Cancelled', count: 8, color: '#ef4444' },
];

// Mock data for order trends (last 7 days)
const orderTrendData: OrderTrendData[] = [
  { date: 'Mon', pending: 5, processing: 8, shipped: 12, delivered: 23, cancelled: 1 },
  { date: 'Tue', pending: 7, processing: 12, shipped: 15, delivered: 28, cancelled: 2 },
  { date: 'Wed', pending: 4, processing: 6, shipped: 9, delivered: 18, cancelled: 1 },
  { date: 'Thu', pending: 9, processing: 15, shipped: 18, delivered: 34, cancelled: 3 },
  { date: 'Fri', pending: 12, processing: 18, shipped: 22, delivered: 41, cancelled: 2 },
  { date: 'Sat', pending: 15, processing: 22, shipped: 28, delivered: 52, cancelled: 1 },
  { date: 'Sun', pending: 8, processing: 14, shipped: 19, delivered: 36, cancelled: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm" style={{ color: data.color }}>
          Count: {formatNumber(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export function OrdersChart() {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders by Status</CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              Total Orders: <span className="font-medium text-foreground">{formatNumber(totalOrders)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              Trend
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
            >
              Status
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                <Bar dataKey="processing" stackId="a" fill="#3b82f6" name="Processing" />
                <Bar dataKey="shipped" stackId="a" fill="#8b5cf6" name="Shipped" />
                <Bar dataKey="delivered" stackId="a" fill="#10b981" name="Delivered" />
                <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Status Legend for Pie Chart */}
        {chartType === 'pie' && (
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {orderStatusData.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.status}: {formatNumber(item.count)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}