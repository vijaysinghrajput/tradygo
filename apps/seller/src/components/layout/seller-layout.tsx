'use client';

import { useState } from 'react';
import { SellerSidebar } from './seller-sidebar';
import { SellerHeader } from './seller-header';
import { SellerFooter } from './seller-footer';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <SellerSidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onOpenChange={setSidebarOpen}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        {/* Header */}
        <SellerHeader
          onMenuClick={() => setSidebarOpen(true)}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Page Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />
            
            {/* Page Content */}
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <SellerFooter />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}