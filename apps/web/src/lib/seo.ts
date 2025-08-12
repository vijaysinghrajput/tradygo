import { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = 'TradyGo - Multi-vendor E-commerce Platform';
const DEFAULT_DESCRIPTION = 'Discover amazing products from trusted sellers on TradyGo. Shop electronics, fashion, books, and more with fast delivery and secure payments.';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradygo.in';

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = [],
    canonical,
    ogImage,
    ogType = 'website',
    noIndex = false,
  } = config;

  const fullTitle = title ? `${title} | TradyGo` : DEFAULT_TITLE;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const imageUrl = ogImage ? `${SITE_URL}${ogImage}` : `${SITE_URL}/og-default.jpg`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      url: canonicalUrl,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title || DEFAULT_TITLE,
      }],
      siteName: 'TradyGo',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(data: Record<string, any>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  });
}

/**
 * Generate organization JSON-LD
 */
export function generateOrganizationJsonLd() {
  return generateJsonLd({
    '@type': 'Organization',
    name: 'TradyGo',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://facebook.com/tradygo',
      'https://twitter.com/tradygo',
      'https://instagram.com/tradygo',
    ],
  });
}

/**
 * Generate product JSON-LD
 */
export function generateProductJsonLd(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
  sku?: string;
  rating?: {
    value: number;
    count: number;
  };
}) {
  const {
    name,
    description,
    image,
    price,
    currency = 'INR',
    availability = 'InStock',
    brand,
    category,
    sku,
    rating,
  } = product;

  const jsonLdData: Record<string, any> = {
    '@type': 'Product',
    name,
    description,
    image: `${SITE_URL}${image}`,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    },
  };

  if (brand) {
    jsonLdData.brand = {
      '@type': 'Brand',
      name: brand,
    };
  }

  if (category) {
    jsonLdData.category = category;
  }

  if (sku) {
    jsonLdData.sku = sku;
  }

  if (rating) {
    jsonLdData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value.toString(),
      reviewCount: rating.count.toString(),
    };
  }

  return generateJsonLd(jsonLdData);
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return generateJsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  });
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

/**
 * Generate website JSON-LD
 */
export function generateWebsiteJsonLd() {
  return generateJsonLd({
    '@type': 'WebSite',
    name: 'TradyGo',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}