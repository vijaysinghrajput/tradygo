'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/auth';
import { accountNavigation } from '@/config/navigation';
import { cn } from '@tradygo/ui';
import { LogOut } from 'lucide-react';
import { Button } from '@tradygo/ui';

interface AccountSidebarProps {
  user: User;
}

export function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Clear cookies
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="bg-white p-6 shadow sm:rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow sm:rounded-lg">
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Account</h3>
          <ul className="space-y-1">
            {accountNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          'mr-3 h-5 w-5 flex-shrink-0',
                          isActive
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </nav>
    </div>
  );
}