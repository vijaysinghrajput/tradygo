import { Metadata } from 'next';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { OrdersChart } from '@/components/dashboard/orders-chart';
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts';
import { BestSellers } from '@/components/dashboard/best-sellers';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { QuickActions } from '@/components/dashboard/quick-actions';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Seller Dashboard - Monitor your store performance and manage inventory',
};

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's how your store is performing today.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Key Performance Indicators */}
      <DashboardStats />
      
      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart />
        <OrdersChart />
      </div>
      
      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentOrders />
        </div>
        <div className="space-y-6">
          <LowStockAlerts />
          <BestSellers />
        </div>
      </div>
    </div>
  );
}