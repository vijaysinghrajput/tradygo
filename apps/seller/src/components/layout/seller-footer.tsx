'use client';

import Link from 'next/link';
import { Clock, HelpCircle, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@tradygo/ui';
import { formatDate } from '@/lib/utils';

export function SellerFooter() {
  // Mock payout cycle data
  const nextPayoutDate = new Date();
  nextPayoutDate.setDate(nextPayoutDate.getDate() + 7);
  
  const currentCycleEnd = new Date();
  currentCycleEnd.setDate(currentCycleEnd.getDate() + 3);

  return (
    <footer className="border-t border-border bg-muted/30 px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Payout Cycle Information */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Current cycle ends:</span>
            <span className="font-medium text-foreground">
              {formatDate(currentCycleEnd)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next payout:</span>
            <span className="font-medium text-foreground">
              {formatDate(nextPayoutDate)}
            </span>
          </div>
        </div>

        {/* Help Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/support"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Support Center
          </Link>
          
          <Link
            href="/support/payout-guide"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Payout Guide
            <ExternalLink className="h-3 w-3" />
          </Link>
          
          <Link
            href="/support/seller-handbook"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Seller Handbook
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          © 2024 TradyGo. All rights reserved. | Seller Portal v1.0
        </p>
      </div>
    </footer>
  );
}