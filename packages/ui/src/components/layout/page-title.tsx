import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const pageTitleVariants = cva(
  'font-bold tracking-tight text-foreground',
  {
    variants: {
      size: {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
      },
      variant: {
        default: '',
        gradient: 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
      },
    },
    defaultVariants: {
      size: 'lg',
      variant: 'default',
    },
  }
);

export interface PageTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof pageTitleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
  ({ className, size, variant, as: Component = 'h1', ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(pageTitleVariants({ size, variant }), className)}
        {...props}
      />
    );
  }
);

PageTitle.displayName = 'PageTitle';