'use client';

import * as React from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';
import { AdminFooter } from './admin-footer';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="admin-layout flex h-screen">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader 
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <main className={cn('admin-main flex-1 p-6', className)}>
          {/* Breadcrumbs */}
          <Breadcrumbs className="mb-6" />
          
          {/* Page Content */}
          <div className="h-full">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}