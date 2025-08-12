'use client';

import { Badge } from '@tradygo/ui';
import { cn } from '@/lib/utils';

interface AdminFooterProps {
  className?: string;
}

export function AdminFooter({ className }: AdminFooterProps) {
  const environment = process.env.NODE_ENV || 'development';
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  const buildHash = process.env.NEXT_PUBLIC_BUILD_HASH || 'dev-build';
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-green-500';
      case 'staging':
        return 'bg-yellow-500';
      case 'development':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <footer className={cn(
      'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="flex h-12 items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {/* Environment */}
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              getEnvironmentColor(environment)
            )} />
            <span className="capitalize">{environment}</span>
          </div>

          {/* Version */}
          <div className="flex items-center gap-1">
            <span>Version:</span>
            <Badge variant="outline" className="text-xs px-1 py-0">
              {version}
            </Badge>
          </div>

          {/* Build Hash */}
          <div className="hidden sm:flex items-center gap-1">
            <span>Build:</span>
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
              {buildHash.substring(0, 8)}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Build Time */}
          <div className="hidden md:flex items-center gap-1">
            <span>Built:</span>
            <time className="font-mono">
              {new Date(buildTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}