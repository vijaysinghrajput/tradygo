'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@tradygo/ui';
import { Input } from '@tradygo/ui';
// Using standard HTML label element since Label is not available in @tradygo/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tradygo/ui';

const vendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  legalName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  initialData?: Partial<VendorFormData>;
  onSubmit: (data: VendorFormData) => void;
  loading?: boolean;
}

export function VendorForm({ initialData, onSubmit, loading = false }: VendorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: VendorFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Business Name *</label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter business name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="legalName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Legal Name</label>
          <Input
            id="legalName"
            {...register('legalName')}
            placeholder="Enter legal business name"
          />
          {errors.legalName && (
            <p className="text-sm text-red-600">{errors.legalName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address *</label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number</label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="gstNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">GST Number</label>
          <Input
            id="gstNumber"
            {...register('gstNumber')}
            placeholder="Enter GST number"
          />
          {errors.gstNumber && (
            <p className="text-sm text-red-600">{errors.gstNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="panNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">PAN Number</label>
          <Input
            id="panNumber"
            {...register('panNumber')}
            placeholder="Enter PAN number"
          />
          {errors.panNumber && (
            <p className="text-sm text-red-600">{errors.panNumber.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? 'Saving...' : initialData ? 'Update Seller' : 'Create Seller'}
        </Button>
      </div>
    </form>
  );
}