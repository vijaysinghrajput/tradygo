'use client';

import { useState } from 'react';
import { SellerSidebar } from './seller-sidebar';
import { SellerTopbar } from './seller-topbar';
import { SellerFooter } from './seller-footer';

interface SellerShellProps {
  children: React.ReactNode;
}

export function SellerShell({ children }: SellerShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SellerSidebar 
        open={sidebarOpen}
        collapsed={sidebarCollapsed} 
        onOpenChange={setSidebarOpen}
        onCollapsedChange={setSidebarCollapsed} 
      />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <SellerTopbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <SellerFooter />
      </div>
    </div>
  );
}