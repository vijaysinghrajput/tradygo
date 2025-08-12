import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradygo.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Fetch dynamic routes from API
    const [categoriesResponse, brandsResponse, productsResponse] = await Promise.allSettled([
      api.get('/categories?limit=100'),
      api.get('/brands?limit=100'),
      api.get('/products?limit=1000&fields=slug,updatedAt'),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [];

    // Add category pages
    if (categoriesResponse.status === 'fulfilled') {
      const categories = categoriesResponse.value.data.categories || [];
      categories.forEach((category: any) => {
        dynamicRoutes.push({
          url: `${SITE_URL}/categories/${category.slug}`,
          lastModified: new Date(category.updatedAt || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }

    // Add brand pages
    if (brandsResponse.status === 'fulfilled') {
      const brands = brandsResponse.value.data.brands || [];
      brands.forEach((brand: any) => {
        dynamicRoutes.push({
          url: `${SITE_URL}/brands/${brand.slug}`,
          lastModified: new Date(brand.updatedAt || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });
    }

    // Add product pages
    if (productsResponse.status === 'fulfilled') {
      const products = productsResponse.value.data.products || [];
      products.forEach((product: any) => {
        dynamicRoutes.push({
          url: `${SITE_URL}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes if API calls fail
    return staticRoutes;
  }
}