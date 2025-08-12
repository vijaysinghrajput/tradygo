import { ReactNode } from 'react';
import { Button } from '@tradygo/ui';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        {Icon && (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
        
        {action && (
          <div className="mt-6">
            {action.href ? (
              <Button asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            ) : (
              <Button onClick={action.onClick}>{action.label}</Button>
            )}
          </div>
        )}
        
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}