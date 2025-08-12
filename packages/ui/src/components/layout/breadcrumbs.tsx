import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({
    className,
    items,
    separator = <ChevronRight className="h-4 w-4" />,
    showHome = true,
    homeHref = '/',
    ...props
  }, ref) => {
    const allItems = showHome
      ? [{ label: 'Home', href: homeHref }, ...items]
      : items;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
        {...props}
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = showHome && index === 0;

            return (
              <li key={index} className="flex items-center space-x-1">
                {index > 0 && (
                  <span className="text-muted-foreground/50">
                    {separator}
                  </span>
                )}
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {isHome ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      item.label
                    )}
                  </a>
                ) : (
                  <span
                    className={cn(
                      isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {isHome ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      item.label
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';