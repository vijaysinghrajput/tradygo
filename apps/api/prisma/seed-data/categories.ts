export interface CategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentSlug?: string;
  sortOrder: number;
  gstRate: number; // GST rate for this category
}

export const categoriesData: CategoryData[] = [
  // Level 1 - Root Categories
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    sortOrder: 1,
    gstRate: 18,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and accessories',
    sortOrder: 2,
    gstRate: 12,
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home appliances and kitchen essentials',
    sortOrder: 3,
    gstRate: 18,
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books and educational materials',
    sortOrder: 4,
    gstRate: 5,
  },

  // Level 2 - Electronics Subcategories
  {
    name: 'Mobiles',
    slug: 'mobiles',
    description: 'Smartphones and mobile accessories',
    parentSlug: 'electronics',
    sortOrder: 1,
    gstRate: 18,
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Laptops and notebooks',
    parentSlug: 'electronics',
    sortOrder: 2,
    gstRate: 18,
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Headphones, speakers, and audio devices',
    parentSlug: 'electronics',
    sortOrder: 3,
    gstRate: 18,
  },

  // Level 2 - Fashion Subcategories
  {
    name: 'Men',
    slug: 'men',
    description: 'Men\'s clothing and accessories',
    parentSlug: 'fashion',
    sortOrder: 1,
    gstRate: 12,
  },
  {
    name: 'Women',
    slug: 'women',
    description: 'Women\'s clothing and accessories',
    parentSlug: 'fashion',
    sortOrder: 2,
    gstRate: 12,
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Kids clothing and accessories',
    parentSlug: 'fashion',
    sortOrder: 3,
    gstRate: 5,
  },

  // Level 2 - Home & Kitchen Subcategories
  {
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    description: 'Kitchen appliances and gadgets',
    parentSlug: 'home-kitchen',
    sortOrder: 1,
    gstRate: 18,
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Home decoration items',
    parentSlug: 'home-kitchen',
    sortOrder: 2,
    gstRate: 18,
  },

  // Level 3 - Detailed Categories
  {
    name: 'Android Phones',
    slug: 'android-phones',
    description: 'Android smartphones',
    parentSlug: 'mobiles',
    sortOrder: 1,
    gstRate: 18,
  },
  {
    name: 'iPhone',
    slug: 'iphone',
    description: 'Apple iPhones',
    parentSlug: 'mobiles',
    sortOrder: 2,
    gstRate: 18,
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'T-shirts for men',
    parentSlug: 'men',
    sortOrder: 1,
    gstRate: 12,
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    description: 'Jeans for men',
    parentSlug: 'men',
    sortOrder: 2,
    gstRate: 12,
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    description: 'Dresses for women',
    parentSlug: 'women',
    sortOrder: 1,
    gstRate: 12,
  },
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional Indian sarees',
    parentSlug: 'women',
    sortOrder: 2,
    gstRate: 5,
  },
];

// GST rate mapping by category slug
export const gstRateMap: Record<string, number> = {
  'electronics': 18,
  'mobiles': 18,
  'laptops': 18,
  'audio': 18,
  'android-phones': 18,
  'iphone': 18,
  'fashion': 12,
  'men': 12,
  'women': 12,
  'kids': 5,
  't-shirts': 12,
  'jeans': 12,
  'dresses': 12,
  'sarees': 5,
  'home-kitchen': 18,
  'kitchen-appliances': 18,
  'home-decor': 18,
  'books': 5,
};