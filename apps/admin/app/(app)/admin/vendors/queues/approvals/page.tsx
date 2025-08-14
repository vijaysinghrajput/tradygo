'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tradygo/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tradygo/ui';
import { Button } from '@tradygo/ui';
import { Badge } from '@tradygo/ui';
import { Input } from '@tradygo/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradygo/ui';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Users,
  FileText,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';

interface PendingVendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  createdAt: string;
  addresses: any[];
  bankAccounts: any[];
  kyc: any[];
  _count: {
    kyc: number;
    bankAccounts: number;
  };
}

interface ApprovalQueueResponse {
  data: PendingVendor[];
  total: number;
  page: number;
  limit: number;
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

export default function ApprovalQueuePage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<PendingVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const limit = 20;

  const fetchApprovalQueue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/vendor-queues/approvals?${params}`);
      if (!response.ok) throw new Error('Failed to fetch approval queue');

      const data: ApprovalQueueResponse = await response.json();
      setVendors(data.data);
      setTotal(data.total);
    } catch (error) {
      showToast('Failed to fetch approval queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalQueue();
  }, [page, search]);

  const handleSingleApproval = async (vendorId: string, action: 'approve' | 'reject') => {
    try {
      const endpoint = action === 'approve' 
        ? '/api/admin/vendor-queues/approvals/bulk-approve'
        : '/api/admin/vendor-queues/approvals/bulk-reject';
      
      const body = action === 'approve'
        ? { vendorIds: [vendorId] }
        : { vendorIds: [vendorId], reason: 'Manual rejection from approval queue' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to ${action} vendor`);

      showToast(`Seller ${action}d successfully`);
      fetchApprovalQueue();
    } catch (error) {
      showToast(`Failed to ${action} vendor`, 'error');
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedVendors.length === 0) {
      showToast('Please select sellers first', 'error');
      return;
    }

    try {
      setBulkLoading(true);
      const endpoint = action === 'approve' 
        ? '/api/admin/vendor-queues/approvals/bulk-approve'
        : '/api/admin/vendor-queues/approvals/bulk-reject';
      
      const body = action === 'approve'
        ? { vendorIds: selectedVendors }
        : { vendorIds: selectedVendors, reason: 'Bulk rejection from approval queue' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to ${action} sellers`);

      const result = await response.json();
      showToast(`${result.updated} sellers ${action}d successfully`);
      setSelectedVendors([]);
      fetchApprovalQueue();
    } catch (error) {
      showToast(`Failed to ${action} sellers`, 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedVendors(prev => 
      prev.length === vendors.length ? [] : vendors.map(v => v.id)
    );
  };

  const getCompletionScore = (vendor: PendingVendor) => {
    let score = 0;
    let total = 4;
    
    if (vendor.phone) score++;
    if (vendor.addresses.length > 0) score++;
    if (vendor.bankAccounts.length > 0) score++;
    if (vendor.kyc.length > 0) score++;
    
    return Math.round((score / total) * 100);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
    <h1 className="text-3xl font-bold tracking-tight">Seller Approval Queue</h1>
          <p className="text-muted-foreground">
            Review and approve pending vendor applications
          </p>
        </div>
        <div className="flex items-center space-x-2">
      {selectedVendors.length > 0 && (
            <>
              <Button
                onClick={() => handleBulkAction('approve')}
                disabled={bulkLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Selected ({selectedVendors.length})
              </Button>
              <Button
                onClick={() => handleBulkAction('reject')}
                disabled={bulkLoading}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Selected ({selectedVendors.length})
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
          {total} sellers waiting for approval
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sellers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === vendors.length && vendors.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
                ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {search ? 'No sellers found matching your search.' : 'No pending approvals.'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => {
                  const completionScore = getCompletionScore(vendor);
                  const isSelected = selectedVendors.includes(vendor.id);

                  return (
                    <TableRow key={vendor.id} className={isSelected ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleVendorSelection(vendor.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.gstNumber && `GST: ${vendor.gstNumber}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{vendor.email}</div>
                          {vendor.phone && (
                            <div className="text-sm text-muted-foreground">
                              {vendor.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                completionScore >= 75 ? 'bg-green-500' :
                                completionScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${completionScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{completionScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{vendor.addresses.length}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{vendor.bankAccounts.length}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{vendor.kyc.length}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(vendor.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            onClick={() => handleSingleApproval(vendor.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 h-8 px-2"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleSingleApproval(vendor.id, 'reject')}
                            className="h-8 px-2"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/vendors/${vendor.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} sellers
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}