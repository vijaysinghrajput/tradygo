import { ReactNode } from 'react';
import { Button } from '@tradygo/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error;
  retry?: () => void;
  showDetails?: boolean;
  children?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content. Please try again.',
  error,
  retry,
  showDetails = false,
  children,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        
        {showDetails && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Error Details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs text-gray-800">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        {retry && (
          <div className="mt-6">
            <Button onClick={retry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}
        
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}