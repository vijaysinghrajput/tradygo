'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { Button, Badge } from '@tradygo/ui';

interface Deal {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  href: string;
  timeLeft: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  totalStock: number;
}

const deals: Deal[] = [
  {
    id: '1',
    title: 'Wireless Bluetooth Earbuds',
    originalPrice: 4999,
    salePrice: 1999,
    image: '/deals/earbuds.jpg',
    href: '/products/wireless-earbuds-deal',
    timeLeft: '2h 45m',
    rating: 4.3,
    reviewCount: 1250,
    soldCount: 850,
    totalStock: 1000,
  },
  {
    id: '2',
    title: 'Smart Fitness Watch',
    originalPrice: 12999,
    salePrice: 7999,
    image: '/deals/smartwatch.jpg',
    href: '/products/smart-fitness-watch-deal',
    timeLeft: '5h 20m',
    rating: 4.5,
    reviewCount: 890,
    soldCount: 420,
    totalStock: 500,
  },
  {
    id: '3',
    title: 'Portable Power Bank 20000mAh',
    originalPrice: 2999,
    salePrice: 1499,
    image: '/deals/powerbank.jpg',
    href: '/products/power-bank-deal',
    timeLeft: '1h 15m',
    rating: 4.2,
    reviewCount: 650,
    soldCount: 780,
    totalStock: 800,
  },
  {
    id: '4',
    title: 'Gaming Mechanical Keyboard',
    originalPrice: 8999,
    salePrice: 4999,
    image: '/deals/keyboard.jpg',
    href: '/products/gaming-keyboard-deal',
    timeLeft: '3h 30m',
    rating: 4.7,
    reviewCount: 420,
    soldCount: 180,
    totalStock: 300,
  },
  {
    id: '5',
    title: 'Wireless Charging Pad',
    originalPrice: 1999,
    salePrice: 999,
    image: '/deals/wireless-charger.jpg',
    href: '/products/wireless-charger-deal',
    timeLeft: '4h 10m',
    rating: 4.1,
    reviewCount: 320,
    soldCount: 560,
    totalStock: 600,
  },
  {
    id: '6',
    title: 'Bluetooth Speaker',
    originalPrice: 3999,
    salePrice: 2299,
    image: '/deals/speaker.jpg',
    href: '/products/bluetooth-speaker-deal',
    timeLeft: '6h 45m',
    rating: 4.4,
    reviewCount: 780,
    soldCount: 340,
    totalStock: 400,
  },
];

export function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = deals.length - itemsPerView.desktop;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = deals.length - itemsPerView.desktop;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  const calculateProgress = (sold: number, total: number) => {
    return (sold / total) * 100;
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="sm"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={prevSlide}
        aria-label="Previous deals"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={nextSlide}
        aria-label="Next deals"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Deals Container */}
      <div className="overflow-hidden mx-8">
        <div 
          ref={scrollContainerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`,
          }}
        >
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
            >
              <div className="bg-background border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Deal Image */}
                <div className="relative aspect-square">
                  <Link href={deal.href}>
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  
                  {/* Discount Badge */}
                  <Badge
                    variant="destructive"
                    className="absolute top-2 left-2"
                  >
                    {calculateDiscount(deal.originalPrice, deal.salePrice)}% OFF
                  </Badge>
                  
                  {/* Time Left */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {deal.timeLeft}
                  </div>
                </div>

                {/* Deal Info */}
                <div className="p-4 space-y-3">
                  <Link href={deal.href}>
                    <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                      {deal.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{deal.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({deal.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-destructive">
                        {formatPrice(deal.salePrice)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sold: {deal.soldCount}</span>
                      <span>Available: {deal.totalStock - deal.soldCount}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-destructive h-2 rounded-full transition-all"
                        style={{ width: `${calculateProgress(deal.soldCount, deal.totalStock)}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full" asChild>
                    <Link href={deal.href}>
                      Grab Deal
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(deals.length / itemsPerView.desktop) }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === Math.floor(currentIndex / itemsPerView.desktop)
                ? 'bg-primary'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => setCurrentIndex(index * itemsPerView.desktop)}
            aria-label={`Go to deal group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}