'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/components/ui/dialog';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  email: string;
}

interface VendorCommission {
  vendorId: string;
  vendorName: string;
  commissionType: 'PERCENTAGE' | 'FLAT';
  commissionValue: number;
}

interface CommissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: any;
  onSuccess: () => void;
}

export function CommissionDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CommissionDialogProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorCommissions, setVendorCommissions] = useState<VendorCommission[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [commissionType, setCommissionType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [commissionValue, setCommissionValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && category) {
      fetchVendors();
      fetchVendorCommissions();
    }
  }, [open, category]);

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/vendors`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    }
  };

  const fetchVendorCommissions = async () => {
    if (!category?.vendorCommissions) return;

    const commissions = category.vendorCommissions
      .filter((vc: any) => vc.isActive)
      .map((vc: any) => ({
        vendorId: vc.vendor.id,
        vendorName: vc.vendor.name,
        commissionType: vc.commissionType,
        commissionValue: vc.commissionValue,
      }));

    setVendorCommissions(commissions);
  };

  const handleAddCommission = async () => {
    if (!selectedVendorId) {
      toast.error('Please select a vendor');
      return;
    }

    if (vendorCommissions.some(vc => vc.vendorId === selectedVendorId)) {
      toast.error('Commission already exists for this vendor');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/vendor-commission`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vendorId: selectedVendorId,
            categoryId: category.id,
            commissionType,
            commissionValue,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to set vendor commission');
      }

      const vendor = vendors.find(v => v.id === selectedVendorId);
      if (vendor) {
        setVendorCommissions([
          ...vendorCommissions,
          {
            vendorId: selectedVendorId,
            vendorName: vendor.name,
            commissionType,
            commissionValue,
          },
        ]);
      }

      setSelectedVendorId('');
      setCommissionValue(0);
      toast.success('Vendor commission added successfully');
    } catch (error) {
      console.error('Error adding vendor commission:', error);
      toast.error('Failed to add vendor commission');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCommission = async (vendorId: string) => {
    setLoading(true);

    try {
      // Set commission to 0 and inactive
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/vendor-commission`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vendorId,
            categoryId: category.id,
            commissionType: 'PERCENTAGE',
            commissionValue: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove vendor commission');
      }

      setVendorCommissions(vendorCommissions.filter(vc => vc.vendorId !== vendorId));
      toast.success('Vendor commission removed successfully');
    } catch (error) {
      console.error('Error removing vendor commission:', error);
      toast.error('Failed to remove vendor commission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Vendor Commissions - {category?.name}</DialogTitle>
          <DialogDescription>
            Set specific commission rates for vendors in this category. These override the default
            category commission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="vendor">Select Vendor</Label>
              <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors
                    .filter(v => !vendorCommissions.some(vc => vc.vendorId === v.id))
                    .map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Label htmlFor="commissionType">Type</Label>
              <Select
                value={commissionType}
                onValueChange={(value: 'PERCENTAGE' | 'FLAT') => setCommissionType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FLAT">Flat Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Label htmlFor="commissionValue">Value</Label>
              <Input
                id="commissionValue"
                type="number"
                step="0.01"
                value={commissionValue}
                onChange={(e) => setCommissionValue(parseFloat(e.target.value) || 0)}
              />
            </div>

            <Button onClick={handleAddCommission} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Commission Type</TableHead>
                  <TableHead>Commission Value</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorCommissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      No vendor-specific commissions set
                    </TableCell>
                  </TableRow>
                ) : (
                  vendorCommissions.map(vc => (
                    <TableRow key={vc.vendorId}>
                      <TableCell>{vc.vendorName}</TableCell>
                      <TableCell>{vc.commissionType}</TableCell>
                      <TableCell>
                        {vc.commissionType === 'PERCENTAGE'
                          ? `${vc.commissionValue}%`
                          : `₹${vc.commissionValue}`}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCommission(vc.vendorId)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Commission Priority</h4>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Vendor-specific category commission (if set above)</li>
              <li>
                2. Category default commission:{' '}
                {category?.hasCustomCommission
                  ? category.commissionType === 'PERCENTAGE'
                    ? `${category.commissionValue}%`
                    : `₹${category.commissionValue}`
                  : 'Not set'}
              </li>
              <li>3. Vendor default commission</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}