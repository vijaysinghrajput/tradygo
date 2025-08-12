'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@tradygo/ui';
import { ArrowRight, Shield, Truck, Headphones, RotateCcw } from 'lucide-react';

interface CMSSection {
  id: string;
  type: 'hero' | 'features' | 'banner' | 'testimonials' | 'newsletter';
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  cta?: {
    text: string;
    href: string;
  };
  items?: any[];
}

// Mock CMS data - in real app this would come from API
const cmsSections: CMSSection[] = [
  {
    id: 'features',
    type: 'features',
    title: 'Why Choose TradyGo?',
    subtitle: 'Experience the best in online shopping',
    items: [
      {
        icon: 'Shield',
        title: 'Secure Shopping',
        description: '100% secure payments with SSL encryption and fraud protection.',
      },
      {
        icon: 'Truck',
        title: 'Fast Delivery',
        description: 'Free shipping on orders above ₹499. Same-day delivery available.',
      },
      {
        icon: 'Headphones',
        title: '24/7 Support',
        description: 'Round-the-clock customer support via chat, email, and phone.',
      },
      {
        icon: 'RotateCcw',
        title: 'Easy Returns',
        description: '30-day hassle-free returns and exchanges on all products.',
      },
    ],
  },
  {
    id: 'banner-1',
    type: 'banner',
    title: 'Exclusive Mobile Deals',
    subtitle: 'Get up to 40% off on latest smartphones',
    content: 'Discover the latest mobile phones from top brands with exclusive discounts and offers.',
    image: '/cms/mobile-banner.jpg',
    cta: {
      text: 'Shop Mobiles',
      href: '/categories/mobiles',
    },
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    title: 'What Our Customers Say',
    subtitle: 'Trusted by millions of happy customers',
    items: [
      {
        name: 'Priya Sharma',
        location: 'Mumbai',
        rating: 5,
        comment: 'Amazing shopping experience! Fast delivery and great customer service.',
        avatar: '/testimonials/priya.jpg',
      },
      {
        name: 'Rahul Kumar',
        location: 'Delhi',
        rating: 5,
        comment: 'Best prices and authentic products. Highly recommended!',
        avatar: '/testimonials/rahul.jpg',
      },
      {
        name: 'Sneha Patel',
        location: 'Bangalore',
        rating: 4,
        comment: 'Great variety of products and easy return policy.',
        avatar: '/testimonials/sneha.jpg',
      },
    ],
  },
  {
    id: 'banner-2',
    type: 'banner',
    title: 'Fashion Week Sale',
    subtitle: 'Trendy clothes at unbeatable prices',
    content: 'Refresh your wardrobe with the latest fashion trends from top brands.',
    image: '/cms/fashion-banner.jpg',
    cta: {
      text: 'Shop Fashion',
      href: '/categories/fashion',
    },
  },
];

const iconMap = {
  Shield,
  Truck,
  Headphones,
  RotateCcw,
};

function FeaturesSection({ section }: { section: CMSSection }) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {section.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.items?.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BannerSection({ section }: { section: CMSSection }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-xl text-muted-foreground mb-4">{section.subtitle}</p>
              <p className="text-muted-foreground mb-6">{section.content}</p>
              {section.cta && (
                <Button asChild size="lg">
                  <Link href={section.cta.href} className="inline-flex items-center">
                    {section.cta.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
            <div className="relative aspect-video lg:aspect-square">
              <Image
                src={section.image || '/placeholder.jpg'}
                alt={section.title || 'Banner'}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ section }: { section: CMSSection }) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {section.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.items?.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-muted-foreground/30'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CMSSectionsProps {
  sections?: CMSSection[];
}

export function CMSSections({ sections }: CMSSectionsProps) {
  const sectionsToRender = sections || cmsSections;
  
  return (
    <div className="space-y-0">
      {sectionsToRender.map((section) => {
        switch (section.type) {
          case 'features':
            return <FeaturesSection key={section.id} section={section} />;
          case 'banner':
            return <BannerSection key={section.id} section={section} />;
          case 'testimonials':
            return <TestimonialsSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}