import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@tradygo/ui';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  productCount: number;
}

const featuredCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Latest gadgets and tech',
    image: '/categories/electronics.jpg',
    href: '/categories/electronics',
    productCount: 1250,
  },
  {
    id: '2',
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: '/categories/fashion.jpg',
    href: '/categories/fashion',
    productCount: 2100,
  },
  {
    id: '3',
    name: 'Home & Garden',
    description: 'Everything for your home',
    image: '/categories/home-garden.jpg',
    href: '/categories/home-garden',
    productCount: 890,
  },
  {
    id: '4',
    name: 'Sports & Outdoors',
    description: 'Gear for active lifestyle',
    image: '/categories/sports.jpg',
    href: '/categories/sports',
    productCount: 650,
  },
  {
    id: '5',
    name: 'Books',
    description: 'Knowledge and entertainment',
    image: '/categories/books.jpg',
    href: '/categories/books',
    productCount: 3200,
  },
  {
    id: '6',
    name: 'Beauty & Health',
    description: 'Personal care essentials',
    image: '/categories/beauty.jpg',
    href: '/categories/beauty',
    productCount: 780,
  },
];

export function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {featuredCategories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          className="group block"
        >
          <div className="relative overflow-hidden rounded-lg bg-muted aspect-square">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-white font-semibold text-sm md:text-base">
                {category.name}
              </h3>
              <p className="text-white/80 text-xs hidden md:block">
                {category.description}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {category.productCount.toLocaleString()} items
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}