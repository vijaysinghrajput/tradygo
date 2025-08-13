import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '../../components/auth/forgot-password-form';
import { generateMetadata as generateSEOMetadata } from '../../lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Forgot Password',
  description: 'Reset your TradyGo account password. Enter your email address and we\'ll send you a link to reset your password.',
  canonical: '/forgot-password',
  noIndex: true, // Don't index auth pages
});

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <ForgotPasswordForm />
          
          <div className="mt-6">
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                ← Back to sign in
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}