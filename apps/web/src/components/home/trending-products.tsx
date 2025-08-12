'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button, Badge } from '@tradygo/ui';
import { useCart } from '@/hooks/use-cart';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  href: string;
  badge?: string;
  sellerId: string;
  sellerName: string;
}

interface TrendingProductsProps {
  products?: Product[];
}

const trendingProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 134900,
    originalPrice: 159900,
    image: '/products/iphone-15-pro.jpg',
    rating: 4.8,
    reviewCount: 1250,
    href: '/products/iphone-15-pro-max',
    badge: 'Bestseller',
    sellerId: 'apple-store',
    sellerName: 'Apple Store',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 124999,
    originalPrice: 139999,
    image: '/products/galaxy-s24.jpg',
    rating: 4.7,
    reviewCount: 890,
    href: '/products/samsung-galaxy-s24-ultra',
    badge: 'New',
    sellerId: 'samsung-official',
    sellerName: 'Samsung Official',
  },
  {
    id: '3',
    name: 'MacBook Pro 14"',
    price: 199900,
    originalPrice: 219900,
    image: '/products/macbook-pro.jpg',
    rating: 4.9,
    reviewCount: 650,
    href: '/products/macbook-pro-14',
    sellerId: 'apple-store',
    sellerName: 'Apple Store',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 29990,
    originalPrice: 34990,
    image: '/products/sony-headphones.jpg',
    rating: 4.6,
    reviewCount: 2100,
    href: '/products/sony-wh-1000xm5',
    badge: 'Deal',
    sellerId: 'sony-store',
    sellerName: 'Sony Store',
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    price: 12995,
    originalPrice: 15995,
    image: '/products/nike-air-max.jpg',
    rating: 4.5,
    reviewCount: 1800,
    href: '/products/nike-air-max-270',
    sellerId: 'nike-official',
    sellerName: 'Nike Official',
  },
  {
    id: '6',
    name: 'Dell XPS 13',
    price: 89990,
    originalPrice: 99990,
    image: '/products/dell-xps.jpg',
    rating: 4.4,
    reviewCount: 420,
    href: '/products/dell-xps-13',
    badge: 'Limited',
    sellerId: 'dell-store',
    sellerName: 'Dell Store',
  },
  {
    id: '7',
    name: 'iPad Pro 12.9"',
    price: 112900,
    originalPrice: 129900,
    image: '/products/ipad-pro.jpg',
    rating: 4.7,
    reviewCount: 980,
    href: '/products/ipad-pro-12-9',
    sellerId: 'apple-store',
    sellerName: 'Apple Store',
  },
  {
    id: '8',
    name: 'Adidas Ultraboost 22',
    price: 16999,
    originalPrice: 19999,
    image: '/products/adidas-ultraboost.jpg',
    rating: 4.6,
    reviewCount: 1350,
    href: '/products/adidas-ultraboost-22',
    badge: 'Popular',
    sellerId: 'adidas-official',
    sellerName: 'Adidas Official',
  },
];

export function TrendingProducts({ products }: TrendingProductsProps) {
  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const displayProducts = products && products.length > 0 ? products : trendingProducts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <div key={product.id} className="group product-card">
          <div className="relative overflow-hidden rounded-lg bg-muted aspect-square">
            {/* Product Badge */}
            {product.badge && (
              <Badge
                variant={product.badge === 'Deal' ? 'destructive' : 'secondary'}
                className="absolute top-2 left-2 z-10"
              >
                {product.badge}
              </Badge>
            )}

            {/* Discount Badge */}
            {product.originalPrice && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 z-10"
              >
                {calculateDiscount(product.originalPrice, product.price)}% OFF
              </Badge>
            )}

            {/* Product Image */}
            <Link href={product.href}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Wishlist Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>

            {/* Quick Add to Cart */}
            <Button
              className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-2">
            <Link href={product.href}>
              <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Seller */}
            <p className="text-xs text-muted-foreground">
              by {product.sellerName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}