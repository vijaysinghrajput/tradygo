'use client';

import { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Store,
  Settings,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
  Avatar,
} from '@tradygo/ui';
import { cn } from '@/lib/utils';

interface SellerHeaderProps {
  onMenuClick: () => void;
  onSidebarToggle: () => void;
}

// Mock data for stores (multi-warehouse)
const stores = [
  { id: '1', name: 'Main Store', location: 'Mumbai' },
  { id: '2', name: 'Delhi Warehouse', location: 'Delhi' },
  { id: '3', name: 'Bangalore Hub', location: 'Bangalore' },
];

export function SellerHeader({ onMenuClick, onSidebarToggle }: SellerHeaderProps) {
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 seller-header">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="h-8 w-8 p-0 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="hidden h-8 w-8 p-0 lg:flex"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>

          {/* Store Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">{selectedStore.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {stores.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={cn(
                    'flex items-center gap-2',
                    selectedStore.id === store.id && 'bg-accent'
                  )}
                >
                  <Store className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{store.name}</span>
                    <span className="text-xs text-muted-foreground">{store.location}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">
                    iPhone 15 Pro has only 2 units left
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">New Order</p>
                  <p className="text-xs text-muted-foreground">
                    Order #ORD-2024-001 received
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Payout Processed</p>
                  <p className="text-xs text-muted-foreground">
                    ₹45,230 has been transferred to your account
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-medium">
                    JS
                  </div>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">John Seller</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}