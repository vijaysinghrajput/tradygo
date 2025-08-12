import { Metadata } from 'next';
import { Suspense } from 'react';
import { HeroBanner } from '@/components/home/hero-banner';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { TrendingProducts } from '@/components/home/trending-products';
import { BrandStrip } from '@/components/home/brand-strip';
import { DealsCarousel } from '@/components/home/deals-carousel';
import { CMSSections } from '@/components/home/cms-sections';
import { ProductCardSkeletonGrid } from '@/components/skeletons/product-card-skeleton';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'TradyGo - Your Ultimate Shopping Destination',
  description: 'Discover amazing deals on electronics, fashion, home & garden, sports, and more. Shop with confidence at TradyGo.',
  keywords: 'ecommerce, shopping, electronics, fashion, deals, online store',
  openGraph: {
    title: 'TradyGo - Your Ultimate Shopping Destination',
    description: 'Discover amazing deals on electronics, fashion, home & garden, sports, and more.',
    type: 'website',
    url: 'https://tradygo.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TradyGo - Your Ultimate Shopping Destination',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradyGo - Your Ultimate Shopping Destination',
    description: 'Discover amazing deals on electronics, fashion, home & garden, sports, and more.',
    images: ['/og-image.jpg'],
  },
};

// Server-side data fetching
async function getHomeData() {
  try {
    const [cmsSectionsResponse, trendingProductsResponse] = await Promise.allSettled([
      api.get('/cms/sections?slot=home_*', {
        next: { revalidate: 3600, tags: ['home'] }, // Cache for 1 hour
      }),
      api.get('/products?trending=1&limit=12', {
        next: { revalidate: 1800, tags: ['home', 'products'] }, // Cache for 30 minutes
      }),
    ]);

    return {
      cmsSections: cmsSectionsResponse.status === 'fulfilled' ? cmsSectionsResponse.value.data : null,
      trendingProducts: trendingProductsResponse.status === 'fulfilled' ? trendingProductsResponse.value.data : null,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      cmsSections: null,
      trendingProducts: null,
    };
  }
}

export default async function HomePage() {
  const { cmsSections, trendingProducts } = await getHomeData();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner sections={cmsSections?.banners} />
      
      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <FeaturedCategories />
        </div>
      </section>
      
      {/* Trending Products */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Trending Now
          </h2>
          <Suspense fallback={<ProductCardSkeletonGrid count={8} />}>
            <TrendingProducts products={trendingProducts?.products} />
          </Suspense>
        </div>
      </section>
      
      {/* Brand Strip */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Trusted Brands
          </h2>
          <BrandStrip />
        </div>
      </section>
      
      {/* Deals Carousel */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Today's Deals
          </h2>
          <DealsCarousel />
        </div>
      </section>
      
      {/* CMS Sections */}
      <CMSSections sections={cmsSections?.sections} />
    </div>
  );
}