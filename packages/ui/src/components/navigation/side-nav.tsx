import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const sideNavVariants = cva(
  'flex h-full w-64 flex-col border-r bg-background',
  {
    variants: {
      variant: {
        default: 'border-border',
        ghost: 'border-transparent',
      },
      size: {
        sm: 'w-48',
        md: 'w-64',
        lg: 'w-80',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface SideNavProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sideNavVariants> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(
  ({ className, variant, size, header, footer, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(sideNavVariants({ variant, size }), className)}
        {...props}
      >
        {header && (
          <div className="border-b p-4">
            {header}
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
        {footer && (
          <div className="border-t p-4">
            {footer}
          </div>
        )}
      </aside>
    );
  }
);

SideNav.displayName = 'SideNav';

export interface SideNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export const SideNavItem = React.forwardRef<HTMLDivElement, SideNavItemProps>(
  ({ className, icon, active, disabled, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          active && 'bg-accent text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex h-4 w-4 items-center justify-center">
            {icon}
          </span>
        )}
        {children}
      </div>
    );
  }
);

SideNavItem.displayName = 'SideNavItem';

export interface SideNavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const SideNavGroup = React.forwardRef<HTMLDivElement, SideNavGroupProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-1', className)} {...props}>
        {title && (
          <h4 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h4>
        )}
        {children}
      </div>
    );
  }
);

SideNavGroup.displayName = 'SideNavGroup';