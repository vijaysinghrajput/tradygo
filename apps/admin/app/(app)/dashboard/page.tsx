import { DashboardStats } from '../../../src/components/dashboard/dashboard-stats';
import { SalesChart } from '../../../src/components/dashboard/sales-chart';
import { OrdersChart } from '../../../src/components/dashboard/orders-chart';
import { RecentOrders } from '../../../src/components/dashboard/recent-orders';
import { QuickActions } from '../../../src/components/dashboard/quick-actions';
import { SystemAlerts } from '../../../src/components/dashboard/system-alerts';
import { TopSellers } from '../../../src/components/dashboard/top-sellers';
import { TopCategories } from '../../../src/components/dashboard/top-categories';

// Dashboard page - authentication is handled by the (app) layout
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the TradyGo Admin Panel
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* System Alerts */}
      <SystemAlerts />

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart />
        <OrdersChart />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <RecentOrders />
        </div>
        <div className="space-y-6">
          <TopSellers />
          <TopCategories />
        </div>
      </div>
    </div>
  );
}