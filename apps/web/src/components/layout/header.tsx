'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@tradygo/ui';
import { SearchBar } from '@/components/search/search-bar';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CategoriesMegaMenu } from '../navigation/categories-mega-menu';
import { useState } from 'react';
import { mainNavigation } from '@/config/navigation';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Logo */}
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              T
            </div>
            <span className="hidden font-bold text-xl sm:inline-block">
              TradyGo
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {/* Categories with mega menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <span>Categories</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <CategoriesMegaMenu
              isOpen={isCategoriesOpen}
              onClose={() => setIsCategoriesOpen(false)}
            />
          </div>
          
          {mainNavigation.slice(1).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-lg">
            <SearchBar />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/account/wishlist">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCartOpen(true)}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {/* Cart count badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
              0
            </span>
            <span className="sr-only">Shopping cart</span>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </header>
  );
}