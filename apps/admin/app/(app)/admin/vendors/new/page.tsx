'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@tradygo/ui';
import { Alert, AlertDescription } from '@tradygo/ui';
import { ArrowLeft } from 'lucide-react';
import { VendorOnboardingForm } from '@/components/vendors/vendor-onboarding-form';

export default function NewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('NewVendorPage mounted');
  }, []);

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

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  try {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        padding: '1rem',
        position: 'relative',
        zIndex: 1,
        opacity: 1,
        visibility: 'visible',
        display: 'block'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/vendors')}
              style={{ width: 'fit-content' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sellers
            </Button>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'black' }}>Add New Seller</h1>
              <p style={{ color: '#666' }}>
                Complete seller onboarding with business details, address, and banking information
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Vendor Onboarding Form */}
        <div style={{ width: '100%' }}>
          <VendorOnboardingForm
            onSubmit={handleSubmit}
            loading={loading}
            mode="create"
          />
        </div>
      </div>
    );
  } catch (renderError) {
    console.error('Error rendering NewVendorPage:', renderError);
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '2rem' }}>
        <Alert variant="destructive">
          <AlertDescription>
            An error occurred while loading the vendor creation form. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/vendors')}
          className="flex items-center mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sellers
        </Button>
      </div>
    );
  }
}