'use client';

import React, { useState } from 'react';
import { Button } from '@tradygo/ui';
import { Input } from '@tradygo/ui';
import { Badge } from '@tradygo/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tradygo/ui';
import {
  Building,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  Upload,
  User,
  Phone,
  Mail,
  Hash,
  AlertCircle,
} from 'lucide-react';

interface VendorFormData {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  gstNumber: string;
  panNumber: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    type: string;
  };
  bankAccount: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
  kycDocuments: {
    gstCertificate?: File;
    panCard?: File;
    bankStatement?: File;
    incorporationCertificate?: File;
  };
}

interface VendorOnboardingFormProps {
  initialData?: Partial<VendorFormData>;
  onSubmit: (data: VendorFormData) => Promise<void>;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

export function VendorOnboardingForm({ 
  initialData, 
  onSubmit, 
  loading = false, 
  mode = 'create' 
}: VendorOnboardingFormProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    name: initialData?.name || '',
    legalName: initialData?.legalName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    gstNumber: initialData?.gstNumber || '',
    panNumber: initialData?.panNumber || '',
    address: {
      line1: initialData?.address?.line1 || '',
      line2: initialData?.address?.line2 || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || '',
      country: initialData?.address?.country || 'India',
      postalCode: initialData?.address?.postalCode || '',
      type: initialData?.address?.type || 'BUSINESS',
    },
    bankAccount: {
      accountHolder: initialData?.bankAccount?.accountHolder || '',
      accountNumber: initialData?.bankAccount?.accountNumber || '',
      ifsc: initialData?.bankAccount?.ifsc || '',
      bankName: initialData?.bankAccount?.bankName || '',
      branch: initialData?.bankAccount?.branch || '',
    },
    kycDocuments: initialData?.kycDocuments || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (section: keyof VendorFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && prev[section] !== null
        ? { ...prev[section], ...data }
        : data
    }));
    
    // Clear errors for the updated field
    if (errors[section as string]) {
      setErrors(prev => ({ ...prev, [section]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Business Information Validation
    if (!formData.name.trim()) newErrors.name = 'Business name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
    if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // GST validation (basic)
    if (formData.gstNumber && formData.gstNumber.length !== 15) {
      newErrors.gstNumber = 'GST number should be 15 characters';
    }

    // PAN validation (basic)
    if (formData.panNumber && formData.panNumber.length !== 10) {
      newErrors.panNumber = 'PAN number should be 10 characters';
    }

    // Address Validation
    if (!formData.address.line1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.address.city.trim()) newErrors.addressCity = 'City is required';
    if (!formData.address.state.trim()) newErrors.addressState = 'State is required';
    if (!formData.address.postalCode.trim()) newErrors.addressPostalCode = 'Postal code is required';

    // Bank Account Validation
    if (!formData.bankAccount.accountHolder.trim()) newErrors.bankAccountHolder = 'Account holder name is required';
    if (!formData.bankAccount.accountNumber.trim()) newErrors.bankAccountNumber = 'Account number is required';
    if (!formData.bankAccount.ifsc.trim()) newErrors.bankIfsc = 'IFSC code is required';
    if (!formData.bankAccount.bankName.trim()) newErrors.bankName = 'Bank name is required';

    // IFSC validation (basic)
    if (formData.bankAccount.ifsc && formData.bankAccount.ifsc.length !== 11) {
      newErrors.bankIfsc = 'IFSC code should be 11 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (docType: keyof VendorFormData['kycDocuments'], file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please upload PDF, JPG, or PNG files only', 'error');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size should be less than 10MB', 'error');
      return;
    }

    updateFormData('kycDocuments', { [docType]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      showToast('Failed to submit form', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Enter the vendor's business details and registration information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Name *
              </label>
              <Input
                placeholder="Enter business name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Legal Name
              </label>
              <Input
                placeholder="Enter legal name"
                value={formData.legalName}
                onChange={(e) => updateFormData('legalName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="vendor@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                GST Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="29ABCDE1234F1Z5"
                  value={formData.gstNumber}
                  onChange={(e) => updateFormData('gstNumber', e.target.value.toUpperCase())}
                  className={`pl-10 ${errors.gstNumber ? 'border-red-500' : ''}`}
                  maxLength={15}
                />
              </div>
              {errors.gstNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.gstNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                PAN Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ABCDE1234F"
                  value={formData.panNumber}
                  onChange={(e) => updateFormData('panNumber', e.target.value.toUpperCase())}
                  className={`pl-10 ${errors.panNumber ? 'border-red-500' : ''}`}
                  maxLength={10}
                />
              </div>
              {errors.panNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.panNumber}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Business Address
          </CardTitle>
          <CardDescription>
            Enter the vendor's registered business address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Address Line 1 *
              </label>
              <Input
                placeholder="Street address, building name"
                value={formData.address.line1}
                onChange={(e) => updateFormData('address', { line1: e.target.value })}
                className={errors.addressLine1 ? 'border-red-500' : ''}
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.addressLine1}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Address Line 2
              </label>
              <Input
                placeholder="Apartment, suite, unit, etc."
                value={formData.address.line2}
                onChange={(e) => updateFormData('address', { line2: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                City *
              </label>
              <Input
                placeholder="City"
                value={formData.address.city}
                onChange={(e) => updateFormData('address', { city: e.target.value })}
                className={errors.addressCity ? 'border-red-500' : ''}
              />
              {errors.addressCity && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.addressCity}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                State *
              </label>
              <Input
                placeholder="State"
                value={formData.address.state}
                onChange={(e) => updateFormData('address', { state: e.target.value })}
                className={errors.addressState ? 'border-red-500' : ''}
              />
              {errors.addressState && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.addressState}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Postal Code *
              </label>
              <Input
                placeholder="PIN Code"
                value={formData.address.postalCode}
                onChange={(e) => updateFormData('address', { postalCode: e.target.value })}
                className={errors.addressPostalCode ? 'border-red-500' : ''}
              />
              {errors.addressPostalCode && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.addressPostalCode}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Country
              </label>
              <Input
                value={formData.address.country}
                onChange={(e) => updateFormData('address', { country: e.target.value })}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Bank Account Details
          </CardTitle>
          <CardDescription>
            Enter bank account information for payouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Account Holder Name *
              </label>
              <Input
                placeholder="As per bank records"
                value={formData.bankAccount.accountHolder}
                onChange={(e) => updateFormData('bankAccount', { accountHolder: e.target.value })}
                className={errors.bankAccountHolder ? 'border-red-500' : ''}
              />
              {errors.bankAccountHolder && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.bankAccountHolder}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Number *
              </label>
              <Input
                placeholder="Bank account number"
                value={formData.bankAccount.accountNumber}
                onChange={(e) => updateFormData('bankAccount', { accountNumber: e.target.value })}
                className={errors.bankAccountNumber ? 'border-red-500' : ''}
              />
              {errors.bankAccountNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.bankAccountNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                IFSC Code *
              </label>
              <Input
                placeholder="HDFC0001234"
                value={formData.bankAccount.ifsc}
                onChange={(e) => updateFormData('bankAccount', { ifsc: e.target.value.toUpperCase() })}
                className={errors.bankIfsc ? 'border-red-500' : ''}
                maxLength={11}
              />
              {errors.bankIfsc && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.bankIfsc}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Bank Name *
              </label>
              <Input
                placeholder="Bank name"
                value={formData.bankAccount.bankName}
                onChange={(e) => updateFormData('bankAccount', { bankName: e.target.value })}
                className={errors.bankName ? 'border-red-500' : ''}
              />
              {errors.bankName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.bankName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Branch Name
              </label>
              <Input
                placeholder="Branch name"
                value={formData.bankAccount.branch}
                onChange={(e) => updateFormData('bankAccount', { branch: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            KYC Documents
          </CardTitle>
          <CardDescription>
            Upload required documents for verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: 'gstCertificate', label: 'GST Certificate', required: true },
            { key: 'panCard', label: 'PAN Card', required: true },
            { key: 'bankStatement', label: 'Bank Statement', required: false },
            { key: 'incorporationCertificate', label: 'Incorporation Certificate', required: false },
          ].map((doc) => {
            const file = formData.kycDocuments[doc.key as keyof VendorFormData['kycDocuments']];
            
            return (
              <div key={doc.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{doc.label}</span>
                    {doc.required && <span className="text-red-500">*</span>}
                  </div>
                  {file && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Uploaded
                    </Badge>
                  )}
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id={doc.key}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        handleFileUpload(doc.key as keyof VendorFormData['kycDocuments'], selectedFile);
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor={doc.key} className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </label>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            'Processing...'
          ) : (
            mode === 'create' ? 'Create Vendor' : 'Update Vendor'
          )}
        </Button>
      </div>
    </form>
  );
}