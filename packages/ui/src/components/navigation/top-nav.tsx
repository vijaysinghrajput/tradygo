import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  sticky?: boolean;
}

export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, logo, navigation, actions, sticky = true, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          sticky && 'sticky top-0 z-50',
          className
        )}
        {...props}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {logo && (
              <div className="flex items-center">
                {logo}
              </div>
            )}
            {navigation && (
              <nav className="hidden md:flex items-center gap-6">
                {navigation}
              </nav>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-4">
              {actions}
            </div>
          )}
        </div>
      </header>
    );
  }
);

TopNav.displayName = 'TopNav';