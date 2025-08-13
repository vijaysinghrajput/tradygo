import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '../../components/auth/register-form';
import { generateMetadata as generateSEOMetadata } from '../../lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Create Account',
  description: 'Join TradyGo today and discover amazing products from trusted sellers. Create your free account to start shopping.',
  canonical: '/register',
  noIndex: true, // Don't index auth pages
});

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of happy customers shopping on TradyGo
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/login"
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}