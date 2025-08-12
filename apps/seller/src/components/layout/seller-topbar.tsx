'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Store,
  ChevronDown,
  Settings,
  LogOut,
  UserCircle,
  Package,
  TrendingUp
} from 'lucide-react';
import { Button } from '@tradygo/ui';
import { Input } from '@tradygo/ui';

interface SellerTopbarProps {
  onMenuClick: () => void;
  onToggleCollapse: () => void;
}

export function SellerTopbar({ onMenuClick, onToggleCollapse }: SellerTopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Electronics Store');

  const stores = [
    { id: '1', name: 'Electronics Store', status: 'active' },
    { id: '2', name: 'Fashion Boutique', status: 'active' },
    { id: '3', name: 'Home & Garden', status: 'pending' },
  ];

  const notifications = [
    {
      id: 1,
      title: 'New order received',
      message: 'Order #ORD-12345 for ₹2,499',
      time: '2 minutes ago',
      unread: true,
      type: 'order',
    },
    {
      id: 2,
      title: 'Low stock alert',
      message: 'iPhone 15 Pro has only 3 units left',
      time: '1 hour ago',
      unread: true,
      type: 'inventory',
    },
    {
      id: 3,
      title: 'Payout processed',
      message: '₹15,750 has been transferred to your account',
      time: '3 hours ago',
      unread: false,
      type: 'payout',
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Store Selector */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowStoreSelector(!showStoreSelector)}
            className="flex items-center space-x-2 min-w-[200px] justify-between"
          >
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span className="font-medium">{selectedStore}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {/* Store Dropdown */}
          {showStoreSelector && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
                  Your Stores
                </div>
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store.name);
                      setShowStoreSelector(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-2 text-sm rounded hover:bg-gray-50 ${
                      selectedStore === store.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Store className="h-4 w-4" />
                      <span>{store.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      store.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {store.status}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 p-2">
                <Link
                  href="/profile"
                  className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  Manage Stores
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products, orders..."
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">₹12,450</span>
            <span className="text-gray-500">today</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <Package className="h-4 w-4" />
            <span className="font-medium">23</span>
            <span className="text-gray-500">pending</span>
          </div>
        </div>

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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link
                  href="/notifications"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">John Seller</p>
              <p className="text-xs text-gray-500">john@electronics.com</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserCircle className="mr-3 h-4 w-4" />
                  Profile & KYC
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
                <hr className="my-1" />
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    // Handle logout
                    console.log('Logout clicked');
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}