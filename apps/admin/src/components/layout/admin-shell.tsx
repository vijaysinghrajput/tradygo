'use client';

import { useState } from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';
import { AdminBreadcrumb } from './admin-breadcrumb';
import { AdminFooter } from './admin-footer';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onCollapsedChange={setSidebarCollapsed} 
      />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <AdminTopbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Breadcrumb */}
        <AdminBreadcrumb />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}