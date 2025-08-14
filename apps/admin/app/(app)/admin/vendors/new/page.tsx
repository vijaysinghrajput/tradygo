'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tradygo/ui';
import {
  ArrowLeft,
  Building,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  Save,
  User,
  Phone,
  Mail,
  Hash,
} from 'lucide-react';

interface VendorFormData {
  // Business Information
  name: string;
  legalName: string;
  email: string;
  phone: string;
  gstNumber: string;
  panNumber: string;
  
  // Address Information
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    type: string;
  };
  
  // Bank Account Information
  bankAccount: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
  
  // KYC Documents
  kycDocuments: {
    gstCertificate?: File;
    panCard?: File;
    bankStatement?: File;
    incorporationCertificate?: File;
  };
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

export default function NewVendorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    legalName: '',
    email: '',
    phone: '',
    gstNumber: '',
    panNumber: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      type: 'BUSINESS',
    },
    bankAccount: {
      accountHolder: '',
      accountNumber: '',
      ifsc: '',
      bankName: '',
      branch: '',
    },
    kycDocuments: {},
  });

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const updateFormData = (section: keyof VendorFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && prev[section] !== null
        ? { ...prev[section], ...data }
        : data
    }));
  };

  const validateBusinessInfo = () => {
    const { name, email, phone, gstNumber, panNumber } = formData;
    return name && email && phone && gstNumber && panNumber;
  };

  const validateAddress = () => {
    const { line1, city, state, postalCode } = formData.address;
    return line1 && city && state && postalCode;
  };

  const validateBankAccount = () => {
    const { accountHolder, accountNumber, ifsc, bankName } = formData.bankAccount;
    return accountHolder && accountNumber && ifsc && bankName;
  };

  const handleFileUpload = async (docType: keyof VendorFormData['kycDocuments'], file: File) => {
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'kyc');
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const { publicUrl } = await res.json();
      updateFormData('kycDocuments', { [docType]: Object.assign(file, { uploadedUrl: publicUrl }) });
    } catch (e: any) {
      showToast(e.message || 'Upload failed', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!validateBusinessInfo() || !validateAddress() || !validateBankAccount()) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare KYC documents
      const kycDocuments = Object.entries(formData.kycDocuments)
        .filter(([_, file]) => file)
        .map(([docType, file]) => {
          const docTypeMap: Record<string, string> = {
            gstCertificate: 'GST_CERTIFICATE',
            panCard: 'PAN_CARD',
            bankStatement: 'BANK_STATEMENT',
            incorporationCertificate: 'INCORPORATION_CERTIFICATE',
          };
          
          return {
            docType: docTypeMap[docType],
            docUrl: (file as any).uploadedUrl || '',
          };
        });

      // Complete onboarding in one API call
      const response = await fetch('/api/admin/vendor-onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor: {
            name: formData.name,
            legalName: formData.legalName,
            email: formData.email,
            phone: formData.phone,
            gstNumber: formData.gstNumber,
            panNumber: formData.panNumber,
          },
          address: {
            ...formData.address,
            isDefault: true,
          },
          bankAccount: formData.bankAccount,
          kycDocuments: kycDocuments.length > 0 ? kycDocuments : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to create vendor');
      }

      const result = await response.json();
      showToast('Seller onboarding completed successfully!');
      router.push(`/admin/vendors/${result.vendor.id}`);
    } catch (error: any) {
      showToast(error.message || 'Failed to create vendor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: string) => {
    switch (step) {
      case 'business':
        return validateBusinessInfo() ? 'completed' : 'pending';
      case 'address':
        return validateAddress() ? 'completed' : 'pending';
      case 'bank':
        return validateBankAccount() ? 'completed' : 'pending';
      case 'kyc':
        return Object.keys(formData.kycDocuments).length > 0 ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/vendors')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Seller Onboarding</h1>
            <p className="text-muted-foreground">
              Complete seller registration and setup
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { id: 'business', label: 'Business Info', icon: Building },
              { id: 'address', label: 'Address', icon: MapPin },
              { id: 'bank', label: 'Bank Account', icon: CreditCard },
              { id: 'kyc', label: 'KYC Documents', icon: FileText },
            ].map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2
                      ${
                        status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' :
                        isActive ? 'bg-blue-100 border-blue-500 text-blue-600' :
                        'bg-gray-100 border-gray-300 text-gray-400'
                      }
                    `}>
                      {status === 'completed' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="bank">Bank Account</TabsTrigger>
          <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
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
                  <label className="block text-sm font-medium mb-2">Business Name *</label>
                  <Input
                    placeholder="Enter business name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Legal Name</label>
                  <Input
                    placeholder="Enter legal name"
                    value={formData.legalName}
                    onChange={(e) => updateFormData('legalName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="vendor@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GST Number *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="29ABCDE1234F1Z5"
                      value={formData.gstNumber}
                      onChange={(e) => updateFormData('gstNumber', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">PAN Number *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) => updateFormData('panNumber', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-6">
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
                  <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                  <Input
                    placeholder="Street address, building name"
                    value={formData.address.line1}
                    onChange={(e) => updateFormData('address', { line1: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address Line 2</label>
                  <Input
                    placeholder="Apartment, suite, unit, etc."
                    value={formData.address.line2}
                    onChange={(e) => updateFormData('address', { line2: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <Input
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) => updateFormData('address', { city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <Input
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) => updateFormData('address', { state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code *</label>
                  <Input
                    placeholder="PIN Code"
                    value={formData.address.postalCode}
                    onChange={(e) => updateFormData('address', { postalCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <Input
                    value={formData.address.country}
                    onChange={(e) => updateFormData('address', { country: e.target.value })}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-6">
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
                  <label className="block text-sm font-medium mb-2">Account Holder Name *</label>
                  <Input
                    placeholder="As per bank records"
                    value={formData.bankAccount.accountHolder}
                    onChange={(e) => updateFormData('bankAccount', { accountHolder: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Number *</label>
                  <Input
                    placeholder="Bank account number"
                    value={formData.bankAccount.accountNumber}
                    onChange={(e) => updateFormData('bankAccount', { accountNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">IFSC Code *</label>
                  <Input
                    placeholder="HDFC0001234"
                    value={formData.bankAccount.ifsc}
                    onChange={(e) => updateFormData('bankAccount', { ifsc: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name *</label>
                  <Input
                    placeholder="Bank name"
                    value={formData.bankAccount.bankName}
                    onChange={(e) => updateFormData('bankAccount', { bankName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Branch Name</label>
                  <Input
                    placeholder="Branch name"
                    value={formData.bankAccount.branch}
                    onChange={(e) => updateFormData('bankAccount', { branch: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
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
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {activeTab !== 'business' && (
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ['business', 'address', 'bank', 'kyc'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
            >
              Previous
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeTab !== 'kyc' ? (
            <Button
              onClick={() => {
                const tabs = ['business', 'address', 'bank', 'kyc'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                }
              }}
              disabled={getStepStatus(activeTab) !== 'completed'}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !validateBusinessInfo() || !validateAddress() || !validateBankAccount()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Creating Vendor...' : 'Create Vendor'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}