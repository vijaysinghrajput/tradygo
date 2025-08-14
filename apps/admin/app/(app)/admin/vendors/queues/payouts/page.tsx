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
  DollarSign,
  Eye,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Download,
  CreditCard,
} from 'lucide-react';

interface PayoutStatement {
  id: string;
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  totalFees: number;
  netAmount: number;
  status: 'FINALIZED';
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
  payouts: Array<{
    id: string;
    status: 'INITIATED' | 'FAILED';
    amount: number;
    createdAt: string;
  }>;
}

interface PayoutQueueResponse {
  data: PayoutStatement[];
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

export default function PayoutQueuePage() {
  const router = useRouter();
  const [statements, setStatements] = useState<PayoutStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStatements, setSelectedStatements] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const limit = 20;

  const fetchPayoutQueue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/vendor-queues/payouts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch payout queue');

      const data: PayoutQueueResponse = await response.json();
      setStatements(data.data);
      setTotal(data.total);
    } catch (error) {
      showToast('Failed to fetch payout queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutQueue();
  }, [page, search]);

  const handleBatchPayouts = async () => {
    if (selectedStatements.length === 0) {
      showToast('Please select statements first', 'error');
      return;
    }

    try {
      setBatchLoading(true);
      const response = await fetch('/api/admin/vendor-queues/payouts/batch-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statementIds: selectedStatements }),
      });

      if (!response.ok) throw new Error('Failed to create batch payouts');

      const result = await response.json();
      showToast(`${result.created} payouts created successfully. Total amount: ₹${result.totalAmount.toLocaleString()}`);
      setSelectedStatements([]);
      fetchPayoutQueue();
    } catch (error) {
      showToast('Failed to create batch payouts', 'error');
    } finally {
      setBatchLoading(false);
    }
  };

  const toggleStatementSelection = (statementId: string) => {
    setSelectedStatements(prev => 
      prev.includes(statementId) 
        ? prev.filter(id => id !== statementId)
        : [...prev, statementId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedStatements(prev => 
      prev.length === statements.length ? [] : statements.map(s => s.id)
    );
  };

  const getPayoutStatus = (statement: PayoutStatement) => {
    if (statement.payouts.length === 0) {
      return { status: 'DUE', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    }
    
    const hasInitiated = statement.payouts.some(p => p.status === 'INITIATED');
    const hasFailed = statement.payouts.some(p => p.status === 'FAILED');
    
    if (hasFailed) {
      return { status: 'FAILED', color: 'bg-red-100 text-red-800', icon: AlertCircle };
    }
    
    if (hasInitiated) {
      return { status: 'PROCESSING', color: 'bg-blue-100 text-blue-800', icon: CreditCard };
    }
    
    return { status: 'DUE', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
  };

  const calculateSelectedTotal = () => {
    return statements
      .filter(s => selectedStatements.includes(s.id))
      .reduce((sum, s) => sum + s.netAmount, 0);
  };

  const totalPages = Math.ceil(total / limit);
  const selectedTotal = calculateSelectedTotal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout Queue</h1>
          <p className="text-muted-foreground">
            Process due payouts for finalized vendor statements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedStatements.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">
                Selected: {selectedStatements.length} statements
                <br />
                Total: ₹{selectedTotal.toLocaleString()}
              </div>
              <Button
                onClick={handleBatchPayouts}
                disabled={batchLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Create Batch Payouts ({selectedStatements.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Due Payouts</CardTitle>
              <CardDescription>
                {total} statements with pending payouts
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
                    checked={selectedStatements.length === statements.length && statements.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Since</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
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
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse" /></TableCell>
                  </TableRow>
                ))
              ) : statements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {search ? 'No statements found matching your search.' : 'No pending payouts.'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                statements.map((statement) => {
                  const isSelected = selectedStatements.includes(statement.id);
                  const payoutStatus = getPayoutStatus(statement);
                  const StatusIcon = payoutStatus.icon;

                  return (
                    <TableRow key={statement.id} className={isSelected ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStatementSelection(statement.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{statement.vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {statement.vendor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div className="text-sm">
                            <div>{new Date(statement.periodStart).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              to {new Date(statement.periodEnd).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₹{statement.totalSales.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-red-600">
                          ₹{statement.totalFees.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-green-600">
                          ₹{statement.netAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={payoutStatus.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {payoutStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">
                            {Math.ceil((Date.now() - new Date(statement.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/vendors/${statement.vendor.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // TODO: Implement statement export
                                showToast('Statement export feature coming soon');
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export Statement
                            </DropdownMenuItem>
                            {statement.payouts.length > 0 && (
                              <DropdownMenuItem
                                onClick={() => {
                                  // TODO: Implement payout history view
                                  showToast('Payout history feature coming soon');
                                }}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                View Payout History
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} statements
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

      {/* Summary Card */}
      {statements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statements.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Statements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{statements.reduce((sum, s) => sum + s.netAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Due Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {statements.filter(s => s.payouts.length === 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Payouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {statements.filter(s => s.payouts.some(p => p.status === 'FAILED')).length}
                </div>
                <div className="text-sm text-muted-foreground">Failed Payouts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}