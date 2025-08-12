'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  logo: string;
  href: string;
}

const brands: Brand[] = [
  {
    id: '1',
    name: 'Apple',
    logo: '/brands/apple.svg',
    href: '/brands/apple',
  },
  {
    id: '2',
    name: 'Samsung',
    logo: '/brands/samsung.svg',
    href: '/brands/samsung',
  },
  {
    id: '3',
    name: 'Nike',
    logo: '/brands/nike.svg',
    href: '/brands/nike',
  },
  {
    id: '4',
    name: 'Adidas',
    logo: '/brands/adidas.svg',
    href: '/brands/adidas',
  },
  {
    id: '5',
    name: 'Sony',
    logo: '/brands/sony.svg',
    href: '/brands/sony',
  },
  {
    id: '6',
    name: 'Dell',
    logo: '/brands/dell.svg',
    href: '/brands/dell',
  },
  {
    id: '7',
    name: 'HP',
    logo: '/brands/hp.svg',
    href: '/brands/hp',
  },
  {
    id: '8',
    name: 'Microsoft',
    logo: '/brands/microsoft.svg',
    href: '/brands/microsoft',
  },
  {
    id: '9',
    name: 'LG',
    logo: '/brands/lg.svg',
    href: '/brands/lg',
  },
  {
    id: '10',
    name: 'Canon',
    logo: '/brands/canon.svg',
    href: '/brands/canon',
  },
];

export function BrandStrip() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const brandsPerView = {
    mobile: 3,
    tablet: 5,
    desktop: 6,
  };

  const nextBrands = React.useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = brands.length - brandsPerView.desktop;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, []);

  // Auto-scroll functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextBrands, 3000);
    return () => clearInterval(interval);
  }, [nextBrands, isAutoPlaying]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / brandsPerView.desktop)}%)`,
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex-shrink-0 w-1/3 sm:w-1/5 lg:w-1/6 px-4"
          >
            <Link
              href={brand.href}
              className="block group"
            >
              <div className="bg-white rounded-lg border p-6 h-24 flex items-center justify-center transition-all group-hover:shadow-md group-hover:scale-105">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={40}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(brands.length / brandsPerView.desktop) }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === Math.floor(currentIndex / brandsPerView.desktop)
                ? 'bg-primary'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => setCurrentIndex(index * brandsPerView.desktop)}
            aria-label={`Go to brand group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}