import { faker } from '@faker-js/faker';
import { gstRateMap } from './categories';
import { getRandomPincode } from './pincodes';

// Set deterministic seed
faker.seed(20250811);

// Money helpers - all amounts in paise (integer)
export function rndPricePaise(min: number, max: number): number {
  return Math.floor(faker.number.int({ min: min * 100, max: max * 100 }));
}

export function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

export function calculateGST(paise: number, gstRate: number): number {
  return Math.floor((paise * gstRate) / 100);
}

export function calculateMRP(price: number): number {
  // MRP is 10-40% higher than selling price
  const markup = faker.number.float({ min: 1.1, max: 1.4 });
  return Math.floor(price * markup);
}

// SKU generation with uniqueness guarantee
let skuCounter = 0;
export function generateSKU(productSlug: string, attributes: Record<string, any>): string {
  const attrString = Object.entries(attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  const combined = `${productSlug}|${attrString}|${Date.now()}|${++skuCounter}`;
  // Create a simple hash-like string
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const hashStr = Math.abs(hash).toString(36).toUpperCase();
  return `SKU${hashStr.padStart(8, '0')}`;
}

// Slug generation
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Date helpers
export function getRandomDateInRange(daysBack: number = 120): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  return faker.date.between({ from: pastDate, to: now });
}

export function getRandomFutureDate(daysAhead: number = 30): Date {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
  return faker.date.between({ from: now, to: futureDate });
}

// Random ranges
export function getRandomInt(min: number, max: number): number {
  return faker.number.int({ min, max });
}

export function getRandomFloat(min: number, max: number, precision: number = 2): number {
  return faker.number.float({ min, max, fractionDigits: precision });
}

// Array helpers
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Phone number generation (Indian)
export function generateIndianPhone(): string {
  const prefixes = ['9', '8', '7', '6'];
  const prefix = getRandomItem(prefixes);
  const remaining = faker.string.numeric(9);
  return `${prefix}${remaining}`;
}

// GST number generation (mock)
export function generateGSTIN(stateCode: string = '07'): string {
  // Format: 07AABCU9603R1ZM
  const pan = faker.string.alphanumeric(10).toUpperCase();
  const entityNumber = faker.string.numeric(1);
  const checksum = faker.string.alpha(1).toUpperCase();
  return `${stateCode}${pan}${entityNumber}Z${checksum}`;
}

// PAN number generation (mock)
export function generatePAN(): string {
  // Format: ABCDE1234F
  const letters1 = faker.string.alpha(5).toUpperCase();
  const numbers = faker.string.numeric(4);
  const letter2 = faker.string.alpha(1).toUpperCase();
  return `${letters1}${numbers}${letter2}`;
}

// Bank account generation (mock)
export function generateBankAccount(): {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
} {
  const banks = [
    { name: 'State Bank of India', ifscPrefix: 'SBIN' },
    { name: 'HDFC Bank', ifscPrefix: 'HDFC' },
    { name: 'ICICI Bank', ifscPrefix: 'ICIC' },
    { name: 'Axis Bank', ifscPrefix: 'UTIB' },
    { name: 'Kotak Mahindra Bank', ifscPrefix: 'KKBK' },
    { name: 'Punjab National Bank', ifscPrefix: 'PUNB' },
  ];
  
  const bank = getRandomItem(banks);
  const branchCode = faker.string.alphanumeric(7).toUpperCase();
  
  return {
    accountNumber: faker.string.numeric(12),
    ifscCode: `${bank.ifscPrefix}0${branchCode}`,
    bankName: bank.name,
  };
}

// Razorpay mock IDs
export function generateRazorpayOrderId(): string {
  return `order_${faker.string.alphanumeric(14)}`;
}

export function generateRazorpayPaymentId(): string {
  return `pay_${faker.string.alphanumeric(14)}`;
}

export function generateRazorpaySignature(): string {
  return faker.string.alphanumeric(64);
}

// Tracking and courier helpers
export function generateAWBNumber(): string {
  return faker.string.alphanumeric(12).toUpperCase();
}

export function getRandomCourier(): {
  name: string;
  trackingUrlTemplate: string;
} {
  const couriers = [
    {
      name: 'Delhivery',
      trackingUrlTemplate: 'https://www.delhivery.com/track/package/{awb}',
    },
    {
      name: 'Ekart',
      trackingUrlTemplate: 'https://ekart.flipkart.com/track?awb={awb}',
    },
    {
      name: 'BlueDart',
      trackingUrlTemplate: 'https://www.bluedart.com/tracking/{awb}',
    },
    {
      name: 'DTDC',
      trackingUrlTemplate: 'https://www.dtdc.in/tracking/{awb}',
    },
    {
      name: 'FedEx',
      trackingUrlTemplate: 'https://www.fedex.com/apps/fedextrack/?tracknumbers={awb}',
    },
  ];
  
  return getRandomItem(couriers);
}

// Product attributes generators
export function generateMobileAttributes(): Record<string, any> {
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gold', 'Silver'];
  const storage = ['64GB', '128GB', '256GB', '512GB', '1TB'];
  const ram = ['4GB', '6GB', '8GB', '12GB', '16GB'];
  
  return {
    color: getRandomItem(colors),
    storage: getRandomItem(storage),
    ram: getRandomItem(ram),
  };
}

export function generateFashionAttributes(): Record<string, any> {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple'];
  
  return {
    size: getRandomItem(sizes),
    color: getRandomItem(colors),
  };
}

export function generateLaptopAttributes(): Record<string, any> {
  const processors = ['Intel i5', 'Intel i7', 'AMD Ryzen 5', 'AMD Ryzen 7'];
  const ram = ['8GB', '16GB', '32GB'];
  const storage = ['256GB SSD', '512GB SSD', '1TB SSD', '1TB HDD'];
  const colors = ['Silver', 'Black', 'Space Gray'];
  
  return {
    processor: getRandomItem(processors),
    ram: getRandomItem(ram),
    storage: getRandomItem(storage),
    color: getRandomItem(colors),
  };
}

export function generateBookAttributes(): Record<string, any> {
  const formats = ['Paperback', 'Hardcover', 'Kindle Edition'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'];
  
  return {
    format: getRandomItem(formats),
    language: getRandomItem(languages),
  };
}

// Weight and dimensions
export function generateProductDimensions(): {
  length: number;
  width: number;
  height: number;
  weight: number;
} {
  return {
    length: getRandomFloat(5, 50, 1), // cm
    width: getRandomFloat(5, 30, 1),  // cm
    height: getRandomFloat(1, 20, 1), // cm
    weight: getRandomFloat(0.1, 5, 2), // kg
  };
}

// Media helpers
export function generateProductImages(sku: string, count: number = 3): string[] {
  const images: string[] = [];
  for (let i = 1; i <= count; i++) {
    images.push(`products/${sku}/${i}.jpg`);
  }
  return images;
}

// Order number generation
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = faker.string.numeric(4);
  return `TG${timestamp}${random}`;
}

// Coupon code generation
export function generateCouponCode(prefix: string = ''): string {
  const code = faker.string.alphanumeric(8).toUpperCase();
  return prefix ? `${prefix}${code}` : code;
}

// Review helpers
export function generateReviewText(rating: number): string {
  const positiveReviews = [
    'Excellent product! Highly recommended.',
    'Great quality and fast delivery.',
    'Amazing value for money.',
    'Perfect product, exactly as described.',
    'Outstanding quality and service.',
    'Very satisfied with this purchase.',
    'Superb product quality.',
    'Fantastic! Will buy again.',
  ];
  
  const neutralReviews = [
    'Good product, meets expectations.',
    'Decent quality for the price.',
    'Average product, nothing special.',
    'Okay product, could be better.',
    'Fair quality, reasonable price.',
  ];
  
  const negativeReviews = [
    'Not as expected, disappointed.',
    'Poor quality, not worth the money.',
    'Product arrived damaged.',
    'Below average quality.',
    'Not satisfied with the purchase.',
  ];
  
  if (rating >= 4) {
    return getRandomItem(positiveReviews);
  } else if (rating >= 3) {
    return getRandomItem(neutralReviews);
  } else {
    return getRandomItem(negativeReviews);
  }
}

// Batch processing helper
export async function processBatch<T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<any>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processor(batch);
  }
}

// Environment variable helpers
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
}

export function getEnvNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  return parsed;
}

export function getEnvBoolean(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}