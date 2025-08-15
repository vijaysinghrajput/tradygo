'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@tradygo/ui';
import { Alert, AlertDescription } from '@tradygo/ui';
import { ArrowLeft } from 'lucide-react';
import { VendorOnboardingForm } from '@/components/vendors/vendor-onboarding-form';

export default function NewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/vendor-onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor: {
            name: formData.name,
            legalName: formData.legalName,
            email: formData.email,
            phone: formData.phone,
            gstNumber: formData.gstNumber,
            panNumber: formData.panNumber,
          },
          address: formData.address,
          bankAccount: formData.bankAccount,
          kycDocuments: formData.kycDocuments ? Object.entries(formData.kycDocuments).map(([type, file]) => ({
            type: type.toUpperCase(),
            documentNumber: `DOC-${Date.now()}`,
            documentUrl: file ? `uploads/${type}-${Date.now()}` : '',
          })) : [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vendor');
      }

      const result = await response.json();
      router.push(`/admin/vendors/${result.vendor.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/vendors')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sellers
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Seller</h1>
          <p className="text-muted-foreground">
            Complete seller onboarding with business details, address, and banking information
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Vendor Onboarding Form */}
      <VendorOnboardingForm
        onSubmit={handleSubmit}
        loading={loading}
        mode="create"
      />
    </div>
  );
}