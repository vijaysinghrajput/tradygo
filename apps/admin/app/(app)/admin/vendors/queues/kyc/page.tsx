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
// Dialog and Textarea components not available in UI library
// Using basic modal and textarea implementations
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
  FileText,
  ExternalLink,
  MoreHorizontal,
  Download,
} from 'lucide-react';

interface KycDocument {
  id: string;
  docType: string;
  docUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
}

interface KycQueueResponse {
  data: KycDocument[];
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

const docTypeLabels: Record<string, string> = {
  GST_CERTIFICATE: 'GST Certificate',
  PAN_CARD: 'PAN Card',
  AADHAAR_CARD: 'Aadhaar Card',
  INCORPORATION_CERTIFICATE: 'Incorporation Certificate',
  CANCELLED_CHEQUE: 'Cancelled Cheque',
  BANK_STATEMENT: 'Bank Statement',
  OTHER: 'Other Document',
};

export default function KycQueuePage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    document?: KycDocument;
    action?: 'approve' | 'reject';
  }>({ open: false });
  const [remarks, setRemarks] = useState('');
  const limit = 20;

  const fetchKycQueue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/vendor-queues/kyc?${params}`);
      if (!response.ok) throw new Error('Failed to fetch KYC queue');

      const data: KycQueueResponse = await response.json();
      setDocuments(data.data);
      setTotal(data.total);
    } catch (error) {
      showToast('Failed to fetch KYC queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycQueue();
  }, [page, search]);

  const handleSingleReview = async (docId: string, action: 'approve' | 'reject', remarks?: string) => {
    try {
      const endpoint = action === 'approve' 
        ? '/api/admin/vendor-queues/kyc/bulk-approve'
        : '/api/admin/vendor-queues/kyc/bulk-reject';
      
      const body = action === 'approve'
        ? { kycIds: [docId] }
        : { kycIds: [docId], remarks: remarks || 'Manual rejection from KYC queue' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to ${action} KYC document`);

      showToast(`KYC document ${action}d successfully`);
      setReviewDialog({ open: false });
      setRemarks('');
      fetchKycQueue();
    } catch (error) {
      showToast(`Failed to ${action} KYC document`, 'error');
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedDocs.length === 0) {
      showToast('Please select documents first', 'error');
      return;
    }

    try {
      setBulkLoading(true);
      const endpoint = action === 'approve' 
        ? '/api/admin/vendor-queues/kyc/bulk-approve'
        : '/api/admin/vendor-queues/kyc/bulk-reject';
      
      const body = action === 'approve'
        ? { kycIds: selectedDocs }
        : { kycIds: selectedDocs, remarks: 'Bulk rejection from KYC queue' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Failed to ${action} KYC documents`);

      const result = await response.json();
      showToast(`${result.updated} KYC documents ${action}d successfully`);
      setSelectedDocs([]);
      fetchKycQueue();
    } catch (error) {
      showToast(`Failed to ${action} KYC documents`, 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedDocs(prev => 
      prev.length === documents.length ? [] : documents.map(d => d.id)
    );
  };

  const openReviewDialog = (document: KycDocument, action: 'approve' | 'reject') => {
    setReviewDialog({ open: true, document, action });
    setRemarks('');
  };

  const confirmReview = () => {
    if (reviewDialog.document && reviewDialog.action) {
      handleSingleReview(reviewDialog.document.id, reviewDialog.action, remarks);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KYC Review Queue</h1>
          <p className="text-muted-foreground">
            Review and approve pending KYC documents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedDocs.length > 0 && (
            <>
              <Button
                onClick={() => handleBulkAction('approve')}
                disabled={bulkLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Selected ({selectedDocs.length})
              </Button>
              <Button
                onClick={() => handleBulkAction('reject')}
                disabled={bulkLoading}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Selected ({selectedDocs.length})
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending KYC Documents</CardTitle>
              <CardDescription>
                {total} documents waiting for review
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
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
                    checked={selectedDocs.length === documents.length && documents.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Vendor Status</TableHead>
                <TableHead>Document</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
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
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {search ? 'No documents found matching your search.' : 'No pending KYC documents.'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => {
                  const isSelected = selectedDocs.includes(doc.id);

                  return (
                    <TableRow key={doc.id} className={isSelected ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDocSelection(doc.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.vendor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {docTypeLabels[doc.docType] || doc.docType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            doc.vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            doc.vendor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            doc.vendor.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {doc.vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.docUrl, '_blank')}
                          className="h-8"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            onClick={() => openReviewDialog(doc, 'approve')}
                            className="bg-green-600 hover:bg-green-700 h-8 px-2"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openReviewDialog(doc, 'reject')}
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
                                onClick={() => router.push(`/admin/vendors/${doc.vendor.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Vendor
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => window.open(doc.docUrl, '_blank')}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
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
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} documents
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

      {/* Review Modal */}
      {reviewDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} KYC Document
              </h3>
              {reviewDialog.document && (
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Vendor:</strong> {reviewDialog.document.vendor.name}
                  </p>
                  <p>
                    <strong>Document:</strong> {docTypeLabels[reviewDialog.document.docType] || reviewDialog.document.docType}
                  </p>
                  <p>
                    <strong>Action:</strong> {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} this document
                  </p>
                </div>
              )}
            </div>
            
            {reviewDialog.action === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Please provide a reason for rejection..."
                  value={remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setReviewDialog({ open: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReview}
                className={
                  reviewDialog.action === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}