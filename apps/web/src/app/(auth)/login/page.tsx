import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '../../components/auth/login-form';
import { generateMetadata as generateSEOMetadata } from '../../lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Login',
  description: 'Sign in to your TradyGo account to access your orders, wishlist, and personalized shopping experience.',
  canonical: '/login',
  noIndex: true, // Don't index auth pages
});

export default function LoginPage({
  searchParams,
}: {
  searchParams: { returnUrl?: string; error?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {searchParams.error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {searchParams.error === 'invalid_credentials' && 'Invalid email or password.'}
                {searchParams.error === 'account_not_verified' && 'Please verify your account before signing in.'}
                {searchParams.error === 'account_disabled' && 'Your account has been disabled. Please contact support.'}
                {!['invalid_credentials', 'account_not_verified', 'account_disabled'].includes(searchParams.error) && 
                  'An error occurred during sign in. Please try again.'}
              </div>
            </div>
          )}
          
          <LoginForm returnUrl={searchParams.returnUrl} />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">New to TradyGo?</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/register"
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Link>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            By signing in, you agree to our{' '}
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