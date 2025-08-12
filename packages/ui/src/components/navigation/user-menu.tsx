import * as React from 'react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export interface UserMenuProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    initials?: string;
  };
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    separator?: boolean;
  }>;
  onSignOut?: () => void;
  className?: string;
}

export const UserMenu = React.forwardRef<HTMLButtonElement, UserMenuProps>(
  ({ user, menuItems = [], onSignOut, className }, ref) => {
    const defaultMenuItems = [
      {
        label: 'Profile',
        icon: <User className="h-4 w-4" />,
      },
      {
        label: 'Settings',
        icon: <Settings className="h-4 w-4" />,
      },
      {
        label: 'Sign out',
        icon: <LogOut className="h-4 w-4" />,
        onClick: onSignOut,
        separator: true,
      },
    ];

    const allMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

    if (!user) {
      return (
        <Button variant="outline" size="sm">
          Sign in
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'relative h-10 w-auto justify-start px-2 py-2',
              className
            )}
            ref={ref}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.initials || user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 hidden text-left sm:block">
              <p className="text-sm font-medium leading-none">
                {user.name || 'User'}
              </p>
              {user.email && (
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name || 'User'}
              </p>
              {user.email && (
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allMenuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={item.onClick}
                className="cursor-pointer"
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

UserMenu.displayName = 'UserMenu';