'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tradygo/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tradygo/ui';
import { Button } from '@tradygo/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@tradygo/ui';
import { Badge } from '@tradygo/ui';
import {
  ArrowLeft,
  Building,
  MapPin,
  CreditCard,
  FileText,
  Percent,
  Package,
  ShoppingCart,
  Receipt,
  DollarSign,
  AlertCircle,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
} from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  legalName?: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  addresses?: any[];
  bankAccounts?: any[];
  kyc?: any[];
  commission?: any[];
  statements?: any[];
  payouts?: any[];
  issues?: any[];
  settings?: any;
  _count?: {
    products: number;
    orders: number;
  };
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  SUSPENDED: { label: 'Suspended', color: 'bg-red-100 text-red-800', icon: Ban },
  REJECTED: { label: 'Rejected', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export default function VendorDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showCommissionAddModal, setShowCommissionAddModal] = useState(false);
  const [commissionEdit, setCommissionEdit] = useState<{ open: boolean; ruleId?: string; currentValue?: number }>({ open: false });

  const [addressForm, setAddressForm] = useState({ line1: '', line2: '', city: '', state: '', postalCode: '' });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const [bankForm, setBankForm] = useState({ accountHolder: '', accountNumber: '', ifsc: '', bankName: '', branch: '' });
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});

  const [kycForm, setKycForm] = useState({ docType: '', docUrl: '' });
  const [kycErrors, setKycErrors] = useState<Record<string, string>>({});

  const [commissionForm, setCommissionForm] = useState({ type: 'PERCENTAGE', value: '5' });
  const [commissionErrors, setCommissionErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/vendors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch vendor');
        const data = await response.json();
        setVendor(data);
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900">Seller not found</h1>
        <p className="text-gray-600 mt-2">The seller you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/admin/vendors')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sellers
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[vendor.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/vendors')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
            <p className="text-muted-foreground">
              {vendor.legalName && vendor.legalName !== vendor.name && (
                <span>{vendor.legalName} • </span>
              )}
              ID: {vendor.id}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={statusInfo.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
          {vendor.status === 'PENDING' && (
            <>
              <Button
                onClick={async () => {
                  await fetch(`/api/admin/vendors/${vendor.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'ACTIVE' }) });
                  location.reload();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await fetch(`/api/admin/vendors/${vendor.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'REJECTED' }) });
                  location.reload();
                }}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
            </>
          )}
          {vendor.status === 'ACTIVE' && (
            <Button
              variant="outline"
              onClick={async () => {
                await fetch(`/api/admin/vendors/${vendor.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'SUSPENDED' }) });
                location.reload();
              }}
            >
              <Ban className="mr-2 h-4 w-4" /> Suspend
            </Button>
          )}
          {vendor.status === 'SUSPENDED' && (
            <Button
              onClick={async () => {
                await fetch(`/api/admin/vendors/${vendor.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'ACTIVE' }) });
                location.reload();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Reactivate
            </Button>
          )}
          <Button onClick={() => router.push(`/admin/vendors/${vendor.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const email = prompt('Seller login email');
              if (!email) return;
              const res = await fetch(`/api/admin/vendors/${vendor.id}/portal-user`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
              const data = await res.json();
              if (res.ok) {
                alert(`Portal access created/linked.\nEmail: ${data.email}\n${data.tempPassword ? `Temp Password: ${data.tempPassword}` : 'User already existed'}`);
              } else {
                alert(data.message || 'Failed to create portal user');
              }
            }}
          >Send Login</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor._count?.products || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor._count?.orders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.addresses?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.bankAccounts?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-sm">{vendor.name}</p>
                </div>
                {vendor.legalName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Legal Name</label>
                    <p className="text-sm">{vendor.legalName}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{vendor.email}</p>
                </div>
                {vendor.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm">{vendor.phone}</p>
                  </div>
                )}
                {vendor.gstNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">GST Number</label>
                    <p className="text-sm">{vendor.gstNumber}</p>
                  </div>
                )}
                {vendor.panNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">PAN Number</label>
                    <p className="text-sm">{vendor.panNumber}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Joined</label>
                  <p className="text-sm">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">{new Date(vendor.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Addresses
              </CardTitle>
              <CardDescription>
                Manage seller business and warehouse addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-3">
                <Button onClick={() => setShowAddressModal(true)}>Add Address</Button>
              </div>
              {vendor.addresses && vendor.addresses.length > 0 ? (
                <div className="space-y-4">
                  {vendor.addresses.map((address: any) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={address.isDefault ? 'default' : 'secondary'}>
                          {address.type} {address.isDefault && '(Default)'}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>{address.city}, {address.state} {address.postalCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No addresses found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank-accounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Bank Accounts
              </CardTitle>
              <CardDescription>
                Manage seller bank account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-3">
                <Button onClick={() => setShowBankModal(true)}>Add Bank Account</Button>
              </div>
              {vendor.bankAccounts && vendor.bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {vendor.bankAccounts.map((account: any) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{account.bankName}</h4>
                        <Badge 
                          variant={account.status === 'VERIFIED' ? 'default' : 
                                 account.status === 'REJECTED' ? 'destructive' : 'secondary'}
                        >
                          {account.status}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>Account Holder:</strong> {account.accountHolder}</p>
                        <p><strong>Account Number:</strong> ****{account.accountNumber.slice(-4)}</p>
                        <p><strong>IFSC:</strong> {account.ifsc}</p>
                        {account.branch && <p><strong>Branch:</strong> {account.branch}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No bank accounts found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                KYC Documents
              </CardTitle>
              <CardDescription>
                Seller identity and business verification documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-3">
                <Button onClick={() => setShowKycModal(true)}>Upload KYC</Button>
              </div>
              {vendor.kyc && vendor.kyc.length > 0 ? (
                <div className="space-y-4">
                  {vendor.kyc.map((doc: any) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{doc.docType.replace('_', ' ')}</h4>
                        <Badge 
                          variant={doc.status === 'APPROVED' ? 'default' : 
                                 doc.status === 'REJECTED' ? 'destructive' : 'secondary'}
                        >
                          {doc.status}
                        </Badge>
                      </div>
                      {doc.remarks && (
                        <p className="text-sm text-muted-foreground mb-2">{doc.remarks}</p>
                      )}
                      <a 
                        href={doc.docUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No KYC documents found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Commission Rules
              </CardTitle>
              <CardDescription>
                Commission rates for different product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-3">
                <Button onClick={() => setShowCommissionAddModal(true)}>Add Rule</Button>
              </div>
              {vendor.commission && vendor.commission.length > 0 ? (
                <div className="space-y-4">
                  {vendor.commission.map((rule: any) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {rule.category || 'Default'} - {rule.type}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {rule.type === 'PERCENTAGE' ? `${rule.value}%` : `₹${rule.value}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setCommissionEdit({ open: true, ruleId: rule.id, currentValue: rule.value })}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={async () => {
                            if (!confirm('Delete rule?')) return;
                            await fetch(`/api/admin/vendors/commissions/${rule.id}`, { method: 'DELETE' });
                            location.reload();
                          }}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No commission rules found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Products
              </CardTitle>
              <CardDescription>
                Products listed by this seller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {vendor._count?.products || 0} products found.
              </p>
              {/* TODO: Add products table */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Orders
              </CardTitle>
              <CardDescription>
                Orders for this seller's products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {vendor._count?.orders || 0} orders found.
              </p>
              {/* TODO: Add orders table */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Financial Statements
              </CardTitle>
              <CardDescription>
                Monthly financial statements and settlements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.statements && vendor.statements.length > 0 ? (
                <div className="space-y-4">
                  {vendor.statements.map((statement: any) => (
                    <div key={statement.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          {new Date(statement.periodStart).toLocaleDateString()} - 
                          {new Date(statement.periodEnd).toLocaleDateString()}
                        </h4>
                        <Badge variant={statement.status === 'FINALIZED' ? 'default' : 'secondary'}>
                          {statement.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Sales</p>
                          <p className="font-medium">₹{statement.totalSales}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Fees</p>
                          <p className="font-medium">₹{statement.totalFees}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Net Amount</p>
                          <p className="font-medium">₹{statement.netAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No statements found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Payouts
              </CardTitle>
              <CardDescription>
                Payment history and pending payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.payouts && vendor.payouts.length > 0 ? (
                <div className="space-y-4">
                  {vendor.payouts.map((payout: any) => (
                    <div key={payout.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">₹{payout.amount}</h4>
                        <Badge 
                          variant={payout.status === 'COMPLETED' ? 'default' : 
                                 payout.status === 'FAILED' ? 'destructive' : 'secondary'}
                        >
                          {payout.status}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        {payout.reference && <p><strong>Reference:</strong> {payout.reference}</p>}
                        <p><strong>Created:</strong> {new Date(payout.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No payouts found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Issues & Support
              </CardTitle>
              <CardDescription>
                Support tickets and issues raised by or for this seller
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendor.issues && vendor.issues.length > 0 ? (
                <div className="space-y-4">
                  {vendor.issues.map((issue: any) => (
                    <div key={issue.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge 
                          variant={issue.status === 'RESOLVED' ? 'default' : 
                                 issue.status === 'CLOSED' ? 'secondary' : 'destructive'}
                        >
                          {issue.status}
                        </Badge>
                      </div>
                      {issue.description && (
                        <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No issues found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Address Modal */}
      <Dialog.Root open={showAddressModal} onOpenChange={setShowAddressModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Add Address</Dialog.Title>
            <div className="space-y-3">
              <Input placeholder="Address Line 1" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} />
              {addressErrors.line1 && <p className="text-xs text-red-600">{addressErrors.line1}</p>}
              <Input placeholder="Address Line 2" value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} />
              <Input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
              {addressErrors.city && <p className="text-xs text-red-600">{addressErrors.city}</p>}
              <Input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
              {addressErrors.state && <p className="text-xs text-red-600">{addressErrors.state}</p>}
              <Input placeholder="Postal Code" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} />
              {addressErrors.postalCode && <p className="text-xs text-red-600">{addressErrors.postalCode}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddressModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                const errs: Record<string, string> = {};
                if (!addressForm.line1) errs.line1 = 'Required';
                if (!addressForm.city) errs.city = 'Required';
                if (!addressForm.state) errs.state = 'Required';
                if (!addressForm.postalCode) errs.postalCode = 'Required';
                setAddressErrors(errs);
                if (Object.keys(errs).length) return;
                await fetch(`/api/admin/vendors/${vendor.id}/addresses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...addressForm, country: 'India', isDefault: true }) });
                location.reload();
              }}>Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Bank Modal */}
      <Dialog.Root open={showBankModal} onOpenChange={setShowBankModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Add Bank Account</Dialog.Title>
            <div className="space-y-3">
              <Input placeholder="Account Holder" value={bankForm.accountHolder} onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })} />
              {bankErrors.accountHolder && <p className="text-xs text-red-600">{bankErrors.accountHolder}</p>}
              <Input placeholder="Account Number" value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })} />
              {bankErrors.accountNumber && <p className="text-xs text-red-600">{bankErrors.accountNumber}</p>}
              <Input placeholder="IFSC" value={bankForm.ifsc} onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })} />
              {bankErrors.ifsc && <p className="text-xs text-red-600">{bankErrors.ifsc}</p>}
              <Input placeholder="Bank Name" value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} />
              {bankErrors.bankName && <p className="text-xs text-red-600">{bankErrors.bankName}</p>}
              <Input placeholder="Branch" value={bankForm.branch} onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBankModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                const errs: Record<string, string> = {};
                if (!bankForm.accountHolder) errs.accountHolder = 'Required';
                if (!bankForm.accountNumber) errs.accountNumber = 'Required';
                if (!bankForm.ifsc || bankForm.ifsc.length !== 11) errs.ifsc = '11 chars';
                if (!bankForm.bankName) errs.bankName = 'Required';
                setBankErrors(errs);
                if (Object.keys(errs).length) return;
                await fetch(`/api/admin/vendors/${vendor.id}/bank-accounts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bankForm) });
                location.reload();
              }}>Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* KYC Modal */}
      <Dialog.Root open={showKycModal} onOpenChange={setShowKycModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Upload KYC</Dialog.Title>
            <div className="space-y-3">
              <Input placeholder="Doc Type (PAN_CARD/GST_CERTIFICATE/BANK_STATEMENT/INCORPORATION_CERTIFICATE)" value={kycForm.docType} onChange={(e) => setKycForm({ ...kycForm, docType: e.target.value })} />
              {kycErrors.docType && <p className="text-xs text-red-600">{kycErrors.docType}</p>}
              <Input placeholder="Public URL" value={kycForm.docUrl} onChange={(e) => setKycForm({ ...kycForm, docUrl: e.target.value })} />
              {kycErrors.docUrl && <p className="text-xs text-red-600">{kycErrors.docUrl}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowKycModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                const errs: Record<string, string> = {};
                if (!kycForm.docType) errs.docType = 'Required';
                if (!kycForm.docUrl) errs.docUrl = 'Required';
                setKycErrors(errs);
                if (Object.keys(errs).length) return;
                await fetch(`/api/admin/vendors/${vendor.id}/kyc`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([{ docType: kycForm.docType, docUrl: kycForm.docUrl }]) });
                location.reload();
              }}>Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Commission Add Modal */}
      <Dialog.Root open={showCommissionAddModal} onOpenChange={setShowCommissionAddModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Add Commission Rule</Dialog.Title>
            <div className="space-y-3">
              <Input placeholder="Type (PERCENTAGE/FLAT)" value={commissionForm.type} onChange={(e) => setCommissionForm({ ...commissionForm, type: e.target.value })} />
              {commissionErrors.type && <p className="text-xs text-red-600">{commissionErrors.type}</p>}
              <Input placeholder="Value" value={commissionForm.value} onChange={(e) => setCommissionForm({ ...commissionForm, value: e.target.value })} />
              {commissionErrors.value && <p className="text-xs text-red-600">{commissionErrors.value}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCommissionAddModal(false)}>Cancel</Button>
              <Button onClick={async () => {
                const errs: Record<string, string> = {};
                const t = commissionForm.type?.toUpperCase();
                const v = parseFloat(commissionForm.value || '0');
                if (!t || (t !== 'PERCENTAGE' && t !== 'FLAT')) errs.type = 'Invalid';
                if (isNaN(v) || v < 0) errs.value = 'Invalid';
                setCommissionErrors(errs);
                if (Object.keys(errs).length) return;
                await fetch(`/api/admin/vendors/${vendor.id}/commissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: t, value: v }) });
                location.reload();
              }}>Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Commission Edit Modal */}
      <Dialog.Root open={commissionEdit.open} onOpenChange={(open) => setCommissionEdit((s) => ({ ...s, open }))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 w-full max-w-md space-y-4 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">Edit Commission Rule</Dialog.Title>
            <div className="space-y-3">
              <Input placeholder="Value" defaultValue={commissionEdit.currentValue} onChange={(e) => setCommissionEdit((s) => ({ ...s, currentValue: parseFloat(e.target.value || '0') }))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCommissionEdit({ open: false })}>Cancel</Button>
              <Button onClick={async () => {
                if (!commissionEdit.ruleId) return;
                const v = Number(commissionEdit.currentValue);
                if (isNaN(v) || v < 0) return;
                await fetch(`/api/admin/vendors/commissions/${commissionEdit.ruleId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: v }) });
                location.reload();
              }}>Save</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}


