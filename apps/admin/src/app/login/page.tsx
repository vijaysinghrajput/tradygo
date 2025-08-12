import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/auth/admin-login-form';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to TradyGo Admin Panel',
  robots: 'noindex,nofollow',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your admin account to manage the platform
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <AdminLoginForm />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            © 2024 TradyGo Technologies Pvt. Ltd.
          </p>
        </div>
      </div>
    </div>
  );
}