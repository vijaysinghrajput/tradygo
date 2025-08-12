'use client';

import { Card } from '@tradygo/ui';
import { formatNumber } from '@/lib/utils';

interface OrderStatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export function OrdersChart() {
  // Mock data - in real app, this would come from API
  const orderData: OrderStatusData[] = [
    {
      status: 'Delivered',
      count: 8947,
      percentage: 45.2,
      color: 'bg-green-500'
    },
    {
      status: 'Shipped',
      count: 4523,
      percentage: 22.8,
      color: 'bg-blue-500'
    },
    {
      status: 'Confirmed',
      count: 3456,
      percentage: 17.4,
      color: 'bg-purple-500'
    },
    {
      status: 'Pending',
      count: 2134,
      percentage: 10.8,
      color: 'bg-yellow-500'
    },
    {
      status: 'Cancelled',
      count: 756,
      percentage: 3.8,
      color: 'bg-red-500'
    }
  ];

  const totalOrders = orderData.reduce((sum, data) => sum + data.count, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Order Status Distribution</h3>
          <p className="text-sm text-muted-foreground">Current month overview</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatNumber(totalOrders)}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
      </div>

      {/* Donut chart using CSS */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-200" />
          
          {/* Progress segments */}
          {orderData.map((data, index) => {
            const prevPercentages = orderData.slice(0, index).reduce((sum, d) => sum + d.percentage, 0);
            const strokeDasharray = `${data.percentage * 2.51} 251`; // 251 is approximate circumference
            const strokeDashoffset = -prevPercentages * 2.51;
            
            return (
              <svg
                key={data.status}
                className="absolute inset-0 w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={data.color.replace('bg-', '').replace('-500', '')}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
            );
          })}
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(totalOrders)}</div>
              <div className="text-sm text-muted-foreground">Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {orderData.map((data) => (
          <div key={data.status} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${data.color}`} />
              <span className="text-sm font-medium">{data.status}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{formatNumber(data.count)}</div>
              <div className="text-xs text-muted-foreground">{data.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {((orderData.find(d => d.status === 'Delivered')?.percentage || 0) + 
                (orderData.find(d => d.status === 'Shipped')?.percentage || 0)).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Fulfillment Rate</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {orderData.find(d => d.status === 'Cancelled')?.percentage || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Cancellation Rate</div>
          </div>
        </div>
      </div>
    </Card>
  );
}