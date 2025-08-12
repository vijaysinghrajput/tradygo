import { Metadata } from 'next';
import { SellerLoginForm } from '@/components/auth/seller-login-form';
import { Store } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seller Login',
  description: 'Sign in to TradyGo Seller Portal',
  robots: 'noindex,nofollow',
};

export default function SellerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Seller Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your store and products
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <SellerLoginForm />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have a seller account?{' '}
            <a href="/register" className="font-medium text-primary hover:text-primary/80">
              Apply to become a seller
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            © 2024 TradyGo Technologies Pvt. Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}