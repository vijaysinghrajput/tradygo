'use client';

import { useState } from 'react';
import { Search, Bell, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button, Input, Avatar, Badge } from '@tradygo/ui';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function AdminHeader({ onToggleSidebar, sidebarCollapsed }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New order received', message: 'Order #12345 from John Doe', time: '2 min ago', unread: true },
    { id: 2, title: 'Low stock alert', message: 'iPhone 15 Pro has only 5 units left', time: '1 hour ago', unread: true },
    { id: 3, title: 'Seller verification', message: 'TechStore completed KYC verification', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, products, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Date range picker placeholder */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Last 30 days
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-md border bg-popover p-0 shadow-md z-50">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all read
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer',
                        notification.unread && 'bg-accent/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-2',
                          notification.unread ? 'bg-primary' : 'bg-muted'
                        )} />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              </Avatar>
              <span className="hidden sm:block text-sm">Admin</span>
            </Button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-1 shadow-md z-50">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@tradygo.com</p>
                </div>
                <div className="py-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <div className="my-1 border-t" />
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}