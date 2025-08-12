import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const statVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        primary: 'border-primary/20 bg-primary/5',
        secondary: 'border-secondary/20 bg-secondary/5',
        success: 'border-success-500/20 bg-success-50 dark:bg-success-950',
        warning: 'border-warning-500/20 bg-warning-50 dark:bg-warning-950',
        destructive: 'border-destructive/20 bg-destructive/5',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface StatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statVariants> {
  title?: string;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ className, variant, size, title, value, description, icon, trend, children, ...props }, ref) => {
    const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
      switch (direction) {
        case 'up':
          return 'text-success-600 dark:text-success-400';
        case 'down':
          return 'text-destructive';
        case 'neutral':
        default:
          return 'text-muted-foreground';
      }
    };

    const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
      switch (direction) {
        case 'up':
          return '↗';
        case 'down':
          return '↘';
        case 'neutral':
        default:
          return '→';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(statVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {title && (
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            )}
            {value && (
              <p className="text-2xl font-bold">
                {value}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1 text-xs', getTrendColor(trend.direction))}>
                <span>{getTrendIcon(trend.direction)}</span>
                <span>{trend.value}%</span>
                {trend.label && <span>{trend.label}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              {icon}
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }
);

Stat.displayName = 'Stat';

export { Stat, statVariants };