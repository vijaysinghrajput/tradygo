import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradygo.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/*',
          '/checkout/*',
          '/api/*',
          '/admin/*',
          '/seller/*',
          '/_next/*',
          '/private/*',
          '/temp/*',
          '*.json',
          '*.xml',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/account/*',
          '/checkout/*',
          '/api/*',
          '/admin/*',
          '/seller/*',
          '/_next/*',
          '/private/*',
          '/temp/*',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/account/*',
          '/checkout/*',
          '/api/*',
          '/admin/*',
          '/seller/*',
          '/_next/*',
          '/private/*',
          '/temp/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}