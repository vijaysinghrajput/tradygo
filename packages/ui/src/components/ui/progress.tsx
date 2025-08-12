import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const progressVariants = cva(
  'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-2',
        md: 'h-4',
        lg: 'h-6',
      },
      variant: {
        default: 'bg-secondary',
        success: 'bg-success-200',
        warning: 'bg-warning-200',
        destructive: 'bg-destructive/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 bg-primary transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        destructive: 'bg-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'className'>,
    VariantProps<typeof progressVariants> {
  className?: string;
  value?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, showValue, formatValue, ...props }, ref) => {
  const displayValue = formatValue ? formatValue(value || 0) : `${value || 0}%`;

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(progressIndicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="mt-1 text-right text-sm text-muted-foreground">
          {displayValue}
        </div>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };