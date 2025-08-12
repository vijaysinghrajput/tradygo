'use client';

import { Card } from '@tradygo/ui';
import { formatCurrency } from '@/lib/utils';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export function SalesChart() {
  // Mock data - in real app, this would come from API
  const salesData: SalesData[] = [
    { date: '2024-01-01', revenue: 45000, orders: 120 },
    { date: '2024-01-02', revenue: 52000, orders: 145 },
    { date: '2024-01-03', revenue: 48000, orders: 132 },
    { date: '2024-01-04', revenue: 61000, orders: 167 },
    { date: '2024-01-05', revenue: 55000, orders: 154 },
    { date: '2024-01-06', revenue: 67000, orders: 189 },
    { date: '2024-01-07', revenue: 59000, orders: 171 },
    { date: '2024-01-08', revenue: 72000, orders: 203 },
    { date: '2024-01-09', revenue: 68000, orders: 192 },
    { date: '2024-01-10', revenue: 74000, orders: 215 },
    { date: '2024-01-11', revenue: 71000, orders: 198 },
    { date: '2024-01-12', revenue: 78000, orders: 224 },
    { date: '2024-01-13', revenue: 82000, orders: 241 },
    { date: '2024-01-14', revenue: 76000, orders: 218 },
  ];

  const maxRevenue = Math.max(...salesData.map(d => d.revenue));
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const avgRevenue = totalRevenue / salesData.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Sales Overview</h3>
          <p className="text-sm text-muted-foreground">Revenue and orders for the last 14 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <div className="text-sm text-muted-foreground">{totalOrders} orders</div>
        </div>
      </div>

      {/* Simple bar chart using CSS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Daily Revenue</span>
          <span>Max: {formatCurrency(maxRevenue)}</span>
        </div>
        
        <div className="h-48 flex items-end justify-between gap-1">
          {salesData.map((data, index) => {
            const height = (data.revenue / maxRevenue) * 100;
            const date = new Date(data.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return (
              <div key={data.date} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${dayName}: ${formatCurrency(data.revenue)} (${data.orders} orders)`}
                  />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div>{formatCurrency(data.revenue)}</div>
                    <div>{data.orders} orders</div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-center">
                  {dayName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{formatCurrency(avgRevenue)}</div>
            <div className="text-sm text-muted-foreground">Avg Daily Revenue</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{Math.round(totalOrders / salesData.length)}</div>
            <div className="text-sm text-muted-foreground">Avg Daily Orders</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{formatCurrency(totalRevenue / totalOrders)}</div>
            <div className="text-sm text-muted-foreground">Avg Order Value</div>
          </div>
        </div>
      </div>
    </Card>
  );
}