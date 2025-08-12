import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger?: React.ReactNode;
  logo?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MobileNav = React.forwardRef<HTMLDivElement, MobileNavProps>(
  ({ className, trigger, logo, open, onOpenChange, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const actualOpen = open !== undefined ? open : isOpen;
    const actualOnOpenChange = onOpenChange || setIsOpen;

    React.useEffect(() => {
      if (actualOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [actualOpen]);

    return (
      <>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => actualOnOpenChange(!actualOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        {/* Overlay */}
        {actualOpen && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => actualOnOpenChange(false)}
          />
        )}

        {/* Mobile menu */}
        <div
          ref={ref}
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-full max-w-sm transform border-r bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out md:hidden',
            actualOpen ? 'translate-x-0' : '-translate-x-full',
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-between">
            {logo && <div className="flex items-center">{logo}</div>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => actualOnOpenChange(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="mt-6">
            {children}
          </div>
        </div>
      </>
    );
  }
);

MobileNav.displayName = 'MobileNav';

export interface MobileNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export const MobileNavItem = React.forwardRef<HTMLDivElement, MobileNavItemProps>(
  ({ className, icon, active, disabled, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          active && 'bg-accent text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex h-5 w-5 items-center justify-center">
            {icon}
          </span>
        )}
        {children}
      </div>
    );
  }
);

MobileNavItem.displayName = 'MobileNavItem';

export interface MobileNavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const MobileNavGroup = React.forwardRef<HTMLDivElement, MobileNavGroupProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {title && (
          <h4 className="px-3 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h4>
        )}
        {children}
      </div>
    );
  }
);

MobileNavGroup.displayName = 'MobileNavGroup';