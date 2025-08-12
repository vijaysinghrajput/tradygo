'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@tradygo/ui';

interface HeroBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
}

interface HeroBannerProps {
  sections?: HeroBannerSlide[];
}

const heroSlides: HeroBannerSlide[] = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 70% Off',
    description: 'Discover amazing deals on electronics, fashion, and more',
    image: '/hero/summer-sale.jpg',
    ctaText: 'Shop Now',
    ctaLink: '/deals',
    backgroundColor: 'from-blue-600 to-purple-600',
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Latest Collection',
    description: 'Explore the newest products from top brands',
    image: '/hero/new-arrivals.jpg',
    ctaText: 'Explore',
    ctaLink: '/categories',
    backgroundColor: 'from-green-600 to-teal-600',
  },
  {
    id: '3',
    title: 'Electronics',
    subtitle: 'Tech Deals',
    description: 'Get the latest gadgets at unbeatable prices',
    image: '/hero/electronics.jpg',
    ctaText: 'Shop Electronics',
    ctaLink: '/categories/electronics',
    backgroundColor: 'from-orange-600 to-red-600',
  },
];

export function HeroBanner({ sections }: HeroBannerProps) {
  const slides = sections && sections.length > 0 ? sections : heroSlides;
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section 
      className="relative h-[500px] md:h-[600px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.backgroundColor} opacity-90`} />
            
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl font-semibold mb-4">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    {slide.description}
                  </p>
                  <Button size="lg" asChild>
                    <Link href={slide.ctaLink}>
                      {slide.ctaText}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}