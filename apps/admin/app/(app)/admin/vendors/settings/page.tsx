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
import { Input } from '@tradygo/ui';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tradygo/ui';
import {
  Settings,
  Percent,
  DollarSign,
  Clock,
  Shield,
  FileText,
  CreditCard,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
} from 'lucide-react';

interface DefaultSettings {
  defaultCommissionRate: number;
  paymentCycle: number;
  productAutoApproval: boolean;
  autoSuspensionRules: {
    maxFailedPayouts: number;
    maxPendingKyc: number;
    inactivityDays: number;
  };
  kycRequirements: {
    requiredDocuments: string[];
    autoApprovalEnabled: boolean;
  };
  payoutSettings: {
    minimumAmount: number;
    processingDays: number;
    autoProcessing: boolean;
  };
}

interface SystemHealth {
  metrics: {
    totalVendors: number;
    activeVendors: number;
    pendingApprovals: number;
    failedPayouts: number;
    pendingKyc: number;
  };
  health: {
    overall: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    issues: string[];
  };
  lastChecked: string;
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

export default function VendorSettingsPage() {
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bulkOperation, setBulkOperation] = useState({
    type: '',
    loading: false,
    vendorIds: '',
    commissionRate: '',
    commissionType: 'PERCENTAGE',
    status: 'ACTIVE',
    reason: '',
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, healthRes] = await Promise.all([
        fetch('/api/admin/vendor-settings/defaults'),
        fetch('/api/admin/vendor-settings/system/health'),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setDefaultSettings(data.vendorDefaults);
      }

      if (healthRes.ok) {
        setSystemHealth(await healthRes.json());
      }
    } catch (error) {
      showToast('Failed to fetch settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (!defaultSettings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/vendor-settings/defaults', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultSettings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      showToast('Settings saved successfully');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkCommissionUpdate = async () => {
    if (!bulkOperation.vendorIds || !bulkOperation.commissionRate) {
      showToast('Please provide seller IDs and commission rate', 'error');
      return;
    }

    try {
      setBulkOperation(prev => ({ ...prev, loading: true }));
      const vendorIds = bulkOperation.vendorIds.split(',').map(id => id.trim()).filter(Boolean);
      
      const response = await fetch('/api/admin/vendor-settings/bulk/commission-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorIds,
          commissionRate: parseFloat(bulkOperation.commissionRate),
          commissionType: bulkOperation.commissionType,
        }),
      });

      if (!response.ok) throw new Error('Failed to update commission rates');

      const result = await response.json();
      showToast(`Updated commission rates for ${result.successful} sellers`);
      setBulkOperation(prev => ({ ...prev, vendorIds: '', commissionRate: '' }));
    } catch (error) {
      showToast('Failed to update commission rates', 'error');
    } finally {
      setBulkOperation(prev => ({ ...prev, loading: false }));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkOperation.vendorIds) {
      showToast('Please provide seller IDs', 'error');
      return;
    }

    try {
      setBulkOperation(prev => ({ ...prev, loading: true }));
      const vendorIds = bulkOperation.vendorIds.split(',').map(id => id.trim()).filter(Boolean);
      
      const response = await fetch('/api/admin/vendor-settings/bulk/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorIds,
          status: bulkOperation.status,
          reason: bulkOperation.reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to update seller status');

      const result = await response.json();
      showToast(`Updated status for ${result.updated} sellers`);
      setBulkOperation(prev => ({ ...prev, vendorIds: '', reason: '' }));
    } catch (error) {
      showToast('Failed to update seller status', 'error');
    } finally {
      setBulkOperation(prev => ({ ...prev, loading: false }));
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/admin/vendor-settings/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error('Failed to export data');

      const data = await response.json();
      
      // Create and download CSV
      const csvContent = [
        Object.keys(data.data[0]).join(','),
        ...data.data.map((row: any) => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast(`Exported ${data.totalRecords} vendor records`);
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'text-green-600';
      case 'WARNING': return 'text-yellow-600';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return CheckCircle;
      case 'WARNING': return AlertCircle;
      case 'CRITICAL': return AlertCircle;
      default: return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seller Settings</h1>
            <p className="text-muted-foreground">Manage default configurations and bulk operations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-40 bg-gray-200 rounded animate-pulse" />
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
          <h1 className="text-3xl font-bold tracking-tight">Seller Settings</h1>
          <p className="text-muted-foreground">
            Manage default configurations and bulk operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchSettings} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Health */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>
              Overall platform health and key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{systemHealth.metrics.totalVendors}</div>
                <div className="text-sm text-muted-foreground">Total Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{systemHealth.metrics.activeVendors}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{systemHealth.metrics.pendingApprovals}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{systemHealth.metrics.failedPayouts}</div>
                <div className="text-sm text-muted-foreground">Failed Payouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{systemHealth.metrics.pendingKyc}</div>
                <div className="text-sm text-muted-foreground">Pending KYC</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                {React.createElement(getHealthIcon(systemHealth.health.overall), {
                  className: `h-5 w-5 ${getHealthColor(systemHealth.health.overall)}`
                })}
                <span className={`font-medium ${getHealthColor(systemHealth.health.overall)}`}>
                  {systemHealth.health.overall}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last checked: {new Date(systemHealth.lastChecked).toLocaleString()}
              </div>
            </div>
            {systemHealth.health.issues.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-1">Issues requiring attention:</div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {systemHealth.health.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="defaults" className="space-y-6">
        <TabsList>
          <TabsTrigger value="defaults">Default Settings</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="defaults" className="space-y-6">
          {defaultSettings && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Commission Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="mr-2 h-5 w-5" />
                    Commission Settings
                  </CardTitle>
                  <CardDescription>
                    Default commission rates and payment cycles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Commission Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={defaultSettings.defaultCommissionRate}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        defaultCommissionRate: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Cycle (days)</label>
                    <Input
                      type="number"
                      value={defaultSettings.paymentCycle}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        paymentCycle: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="productAutoApproval"
                      checked={defaultSettings.productAutoApproval}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        productAutoApproval: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="productAutoApproval" className="text-sm font-medium">
                      Auto-approve new products
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Payout Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payout Settings
                  </CardTitle>
                  <CardDescription>
                    Minimum amounts and processing times
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Payout Amount (₹)</label>
                    <Input
                      type="number"
                      value={defaultSettings.payoutSettings.minimumAmount}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        payoutSettings: {
                          ...defaultSettings.payoutSettings,
                          minimumAmount: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Processing Days</label>
                    <Input
                      type="number"
                      value={defaultSettings.payoutSettings.processingDays}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        payoutSettings: {
                          ...defaultSettings.payoutSettings,
                          processingDays: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoProcessing"
                      checked={defaultSettings.payoutSettings.autoProcessing}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        payoutSettings: {
                          ...defaultSettings.payoutSettings,
                          autoProcessing: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="autoProcessing" className="text-sm font-medium">
                      Enable auto-processing
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Auto-Suspension Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Auto-Suspension Rules
                  </CardTitle>
                  <CardDescription>
                    Automatic vendor suspension triggers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Failed Payouts</label>
                    <Input
                      type="number"
                      value={defaultSettings.autoSuspensionRules.maxFailedPayouts}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        autoSuspensionRules: {
                          ...defaultSettings.autoSuspensionRules,
                          maxFailedPayouts: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Pending KYC Days</label>
                    <Input
                      type="number"
                      value={defaultSettings.autoSuspensionRules.maxPendingKyc}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        autoSuspensionRules: {
                          ...defaultSettings.autoSuspensionRules,
                          maxPendingKyc: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inactivity Days</label>
                    <Input
                      type="number"
                      value={defaultSettings.autoSuspensionRules.inactivityDays}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        autoSuspensionRules: {
                          ...defaultSettings.autoSuspensionRules,
                          inactivityDays: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* KYC Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    KYC Requirements
                  </CardTitle>
                  <CardDescription>
                    Required documents and approval settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Required Documents</label>
                    <div className="space-y-2">
                      {['GST_CERTIFICATE', 'PAN_CARD', 'BANK_STATEMENT', 'AADHAAR_CARD'].map((doc) => (
                        <div key={doc} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={doc}
                            checked={defaultSettings.kycRequirements.requiredDocuments.includes(doc)}
                            onChange={(e) => {
                              const docs = defaultSettings.kycRequirements.requiredDocuments;
                              setDefaultSettings({
                                ...defaultSettings,
                                kycRequirements: {
                                  ...defaultSettings.kycRequirements,
                                  requiredDocuments: e.target.checked
                                    ? [...docs, doc]
                                    : docs.filter(d => d !== doc)
                                }
                              });
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={doc} className="text-sm">
                            {doc.replace('_', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="kycAutoApproval"
                      checked={defaultSettings.kycRequirements.autoApprovalEnabled}
                      onChange={(e) => setDefaultSettings({
                        ...defaultSettings,
                        kycRequirements: {
                          ...defaultSettings.kycRequirements,
                          autoApprovalEnabled: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="kycAutoApproval" className="text-sm font-medium">
                      Enable auto-approval
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bulk Commission Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="mr-2 h-5 w-5" />
                  Bulk Commission Update
                </CardTitle>
                <CardDescription>
                  Update commission rates for multiple vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Vendor IDs (comma-separated)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="vendor1, vendor2, vendor3..."
                    value={bulkOperation.vendorIds}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, vendorIds: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Commission Rate</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={bulkOperation.commissionRate}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, commissionRate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Commission Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={bulkOperation.commissionType}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, commissionType: e.target.value }))}
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FLAT">Flat Amount</option>
                  </select>
                </div>
                <Button 
                  onClick={handleBulkCommissionUpdate} 
                  disabled={bulkOperation.loading}
                  className="w-full"
                >
                  <Percent className="mr-2 h-4 w-4" />
                  {bulkOperation.loading ? 'Updating...' : 'Update Commission Rates'}
                </Button>
              </CardContent>
            </Card>

            {/* Bulk Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Bulk Status Update
                </CardTitle>
                <CardDescription>
                  Change status for multiple vendors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Vendor IDs (comma-separated)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="vendor1, vendor2, vendor3..."
                    value={bulkOperation.vendorIds}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, vendorIds: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={bulkOperation.status}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reason (optional)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Reason for status change..."
                    value={bulkOperation.reason}
                    onChange={(e) => setBulkOperation(prev => ({ ...prev, reason: e.target.value }))}
                    rows={2}
                  />
                </div>
                <Button 
                  onClick={handleBulkStatusUpdate} 
                  disabled={bulkOperation.loading}
                  className="w-full"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {bulkOperation.loading ? 'Updating...' : 'Update Vendor Status'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}