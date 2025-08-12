'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@tradygo/ui';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Something went wrong!
          </h1>
          
          <p className="mt-2 text-gray-600">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs text-gray-800">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            If this problem persists, please{' '}
            <Link 
              href="/contact" 
              className="font-medium text-primary hover:underline"
            >
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}