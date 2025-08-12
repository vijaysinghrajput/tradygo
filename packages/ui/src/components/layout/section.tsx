import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'section' | 'div' | 'article' | 'aside';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const spacingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, as: Component = 'section', spacing = 'md', ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';