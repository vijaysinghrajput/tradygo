'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@tradygo/ui';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 text-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <span className="font-medium">
            🎉 Free shipping on orders over ₹999! Use code: FREESHIP
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}