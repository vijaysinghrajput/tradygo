'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, Grid3X3, Package, Heart, User, Home, Search } from 'lucide-react';
import { Button } from '@tradygo/ui';
import { useAuth } from '@/hooks/use-auth';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-background border-r shadow-lg">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold gradient-text">TradyGo</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  asChild
                >
                  <Link href="/" onClick={handleLinkClick}>
                    <Home className="h-5 w-5 mr-3" />
                    Home
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  asChild
                >
                  <Link href="/search" onClick={handleLinkClick}>
                    <Search className="h-5 w-5 mr-3" />
                    Search
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  asChild
                >
                  <Link href="/categories" onClick={handleLinkClick}>
                    <Grid3X3 className="h-5 w-5 mr-3" />
                    Categories
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  asChild
                >
                  <Link href="/track-order" onClick={handleLinkClick}>
                    <Package className="h-5 w-5 mr-3" />
                    Track Order
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  asChild
                >
                  <Link href="/wishlist" onClick={handleLinkClick}>
                    <Heart className="h-5 w-5 mr-3" />
                    Wishlist
                  </Link>
                </Button>
              </div>

              {/* Categories */}
              <div className="pt-4">
                <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  Shop by Category
                </h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm"
                    asChild
                  >
                    <Link href="/categories/electronics" onClick={handleLinkClick}>
                      Electronics
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm"
                    asChild
                  >
                    <Link href="/categories/fashion" onClick={handleLinkClick}>
                      Fashion
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm"
                    asChild
                  >
                    <Link href="/categories/home-garden" onClick={handleLinkClick}>
                      Home & Garden
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm"
                    asChild
                  >
                    <Link href="/categories/sports" onClick={handleLinkClick}>
                      Sports & Outdoors
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 text-sm"
                    asChild
                  >
                    <Link href="/categories/books" onClick={handleLinkClick}>
                      Books
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Account Section */}
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-sm"
                        asChild
                      >
                        <Link href="/account" onClick={handleLinkClick}>
                          <User className="h-4 w-4 mr-3" />
                          My Account
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-sm"
                        asChild
                      >
                        <Link href="/account/orders" onClick={handleLinkClick}>
                          My Orders
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-sm"
                        asChild
                      >
                        <Link href="/account/addresses" onClick={handleLinkClick}>
                          Addresses
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-sm"
                        asChild
                      >
                        <Link href="/account/support" onClick={handleLinkClick}>
                          Support
                        </Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      asChild
                    >
                      <Link href="/auth/login" onClick={handleLinkClick}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/auth/register" onClick={handleLinkClick}>
                        Create Account
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}