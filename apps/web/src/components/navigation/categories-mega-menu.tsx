'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { mainNavigation } from '@/config/navigation';

interface CategoriesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const featuredCategories = [
  {
    id: 'electronics',
    name: 'Electronics',
    href: '/c/electronics',
    image: '/images/categories/electronics.jpg',
    subcategories: [
      { name: 'Smartphones', href: '/c/electronics/smartphones' },
      { name: 'Laptops', href: '/c/electronics/laptops' },
      { name: 'Headphones', href: '/c/electronics/headphones' },
      { name: 'Cameras', href: '/c/electronics/cameras' },
      { name: 'Gaming', href: '/c/electronics/gaming' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    href: '/c/fashion',
    image: '/images/categories/fashion.jpg',
    subcategories: [
      { name: "Men's Clothing", href: '/c/fashion/mens-clothing' },
      { name: "Women's Clothing", href: '/c/fashion/womens-clothing' },
      { name: 'Shoes', href: '/c/fashion/shoes' },
      { name: 'Accessories', href: '/c/fashion/accessories' },
      { name: 'Watches', href: '/c/fashion/watches' },
    ],
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    href: '/c/home-garden',
    image: '/images/categories/home-garden.jpg',
    subcategories: [
      { name: 'Furniture', href: '/c/home-garden/furniture' },
      { name: 'Kitchen', href: '/c/home-garden/kitchen' },
      { name: 'Decor', href: '/c/home-garden/decor' },
      { name: 'Garden', href: '/c/home-garden/garden' },
      { name: 'Tools', href: '/c/home-garden/tools' },
    ],
  },
  {
    id: 'books',
    name: 'Books',
    href: '/c/books',
    image: '/images/categories/books.jpg',
    subcategories: [
      { name: 'Fiction', href: '/c/books/fiction' },
      { name: 'Non-Fiction', href: '/c/books/non-fiction' },
      { name: 'Educational', href: '/c/books/educational' },
      { name: 'Children', href: '/c/books/children' },
      { name: 'Comics', href: '/c/books/comics' },
    ],
  },
];

export function CategoriesMegaMenu({ isOpen, onClose }: CategoriesMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 top-full z-50 w-screen max-w-4xl bg-white shadow-lg border border-gray-200 rounded-lg mt-1"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              {/* Category Header */}
              <Link
                href={category.href}
                className="group flex items-center justify-between text-sm font-semibold text-gray-900 hover:text-primary"
                onClick={onClose}
              >
                <span>{category.name}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              {/* Category Image */}
              <Link href={category.href} onClick={onClose}>
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{category.name}</span>
                  </div>
                </div>
              </Link>
              
              {/* Subcategories */}
              <ul className="space-y-1">
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.name}>
                    <Link
                      href={subcategory.href}
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                      onClick={onClose}
                    >
                      {subcategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link
              href="/categories"
              className="text-sm font-medium text-primary hover:text-primary/80"
              onClick={onClose}
            >
              View All Categories →
            </Link>
            <div className="flex space-x-4 text-sm text-gray-500">
              <Link href="/deals" className="hover:text-primary" onClick={onClose}>
                Today's Deals
              </Link>
              <Link href="/brands" className="hover:text-primary" onClick={onClose}>
                Top Brands
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}