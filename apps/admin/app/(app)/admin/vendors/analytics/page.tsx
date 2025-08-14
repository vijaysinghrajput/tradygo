'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tradygo/ui';
import { Button } from '@tradygo/ui';
import { Badge } from '@tradygo/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tradygo/ui';
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Percent,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

interface VendorOverview {
  totalVendors: number;
  statusDistribution: {
    ACTIVE: number;
    PENDING: number;
    SUSPENDED: number;
    REJECTED: number;
  };
  activePercentage: number;
}

interface KycAnalytics {
  totalKyc: number;
  statusDistribution: {
    APPROVED: number;
    PENDING: number;
    REJECTED: number;
  };
  approvalRate: number;
  documentTypes: Array<{
    type: string;
    count: number;
  }>;
}

interface FinancialAnalytics {
  totalSales: number;
  totalFees: number;
  totalPayouts: number;
  averageCommissionRate: number;
  monthlyBreakdown: Array<{
    month: string;
    sales: number;
    fees: number;
    payouts: number;
  }>;
}

interface TopVendor {
  id: string;
  name: string;
  email: string;
  totalSales: number;
  totalEarnings: number;
  productCount: number;
  orderCount: number;
  averageOrderValue: number;
}

interface PayoutAnalytics {
  totalPayouts: number;
  statusDistribution: {
    COMPLETED: number;
    INITIATED: number;
    FAILED: number;
  };
  totalAmountPaid: number;
  pendingAmount: number;
  successRate: number;
}

interface CommissionAnalytics {
  totalRules: number;
  averageCommission: number;
  byType: Array<{
    type: string;
    count: number;
    averageRate: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    averageRate: number;
  }>;
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

export default function VendorAnalyticsPage() {
  const [overview, setOverview] = useState<VendorOverview | null>(null);
  const [kycAnalytics, setKycAnalytics] = useState<KycAnalytics | null>(null);
  const [financialAnalytics, setFinancialAnalytics] = useState<FinancialAnalytics | null>(null);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [payoutAnalytics, setPayoutAnalytics] = useState<PayoutAnalytics | null>(null);
  const [commissionAnalytics, setCommissionAnalytics] = useState<CommissionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // days

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, kycRes, financialRes, topVendorsRes, payoutRes, commissionRes] = await Promise.all([
        fetch('/api/admin/vendor-analytics/overview'),
        fetch('/api/admin/vendor-analytics/kyc'),
        fetch(`/api/admin/vendor-analytics/financial?months=6`),
        fetch('/api/admin/vendor-analytics/top-vendors?limit=10'),
        fetch('/api/admin/vendor-analytics/payouts'),
        fetch('/api/admin/vendor-analytics/commissions'),
      ]);

      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (kycRes.ok) setKycAnalytics(await kycRes.json());
      if (financialRes.ok) setFinancialAnalytics(await financialRes.json());
      if (topVendorsRes.ok) setTopVendors(await topVendorsRes.json());
      if (payoutRes.ok) setPayoutAnalytics(await payoutRes.json());
      if (commissionRes.ok) setCommissionAnalytics(await commissionRes.json());
    } catch (error) {
      showToast('Failed to fetch analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights and metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedPeriod === '7' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('7')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === '30' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('30')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === '90' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('90')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                {overview.activePercentage}% active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {overview.statusDistribution.ACTIVE}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for business
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {overview.statusDistribution.PENDING}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {overview.statusDistribution.SUSPENDED}
              </div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Overview */}
      {financialAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialAnalytics.totalSales)}
              </div>
              <p className="text-xs text-muted-foreground">
                Gross marketplace sales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialAnalytics.totalFees)}
              </div>
              <p className="text-xs text-muted-foreground">
                {financialAnalytics.averageCommissionRate}% avg commission
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendor Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(financialAnalytics.totalPayouts)}
              </div>
              <p className="text-xs text-muted-foreground">
                Net vendor earnings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialAnalytics.averageCommissionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average platform fee
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Analytics */}
        {kycAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                KYC Analytics
              </CardTitle>
              <CardDescription>
                Document verification status and approval rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {kycAnalytics.statusDistribution.APPROVED}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {kycAnalytics.statusDistribution.PENDING}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {kycAnalytics.statusDistribution.REJECTED}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Approval Rate</span>
                  <span className="text-sm font-bold">{kycAnalytics.approvalRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${kycAnalytics.approvalRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payout Analytics */}
        {payoutAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payout Analytics
              </CardTitle>
              <CardDescription>
                Payment processing status and success rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {payoutAnalytics.statusDistribution.COMPLETED}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {payoutAnalytics.statusDistribution.INITIATED}
                  </div>
                  <div className="text-sm text-muted-foreground">Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {payoutAnalytics.statusDistribution.FAILED}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Paid</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(payoutAnalytics.totalAmountPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(payoutAnalytics.pendingAmount)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-sm font-bold text-green-600">
                    {payoutAnalytics.successRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Vendors */}
      {topVendors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Top Performing Vendors
            </CardTitle>
            <CardDescription>
              Highest revenue generating vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.map((vendor, index) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(vendor.totalSales)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{vendor.productCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="h-4 w-4 text-gray-400" />
                        <span>{vendor.orderCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(vendor.averageOrderValue)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(vendor.totalEarnings)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Commission Analytics */}
      {commissionAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Commission by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissionAnalytics.byType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.count} rules
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {item.type === 'PERCENTAGE' ? `${item.averageRate}%` : formatCurrency(item.averageRate)}
                      </div>
                      <div className="text-sm text-muted-foreground">avg rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Commission by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissionAnalytics.byCategory.slice(0, 5).map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.count} rules
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.averageRate}%</div>
                      <div className="text-sm text-muted-foreground">avg rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}