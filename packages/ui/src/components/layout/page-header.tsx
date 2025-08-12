import * as React from 'react';
import { cn } from '../../lib/utils';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 pb-8 pt-6 md:flex-row md:items-center md:justify-between',
          className
        )}
        {...props}
      >
        <div className="flex-1 space-y-1">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          )}
          {children}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';