/**
 * Currency formatting utilities
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  symbolPosition: 'before' | 'after';
  thousandsSeparator: string;
  decimalSeparator: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimals: 2,
    symbolPosition: 'before',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    symbolPosition: 'before',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    symbolPosition: 'before',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
};

/**
 * Format amount with currency symbol
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'INR',
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;

  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  
  // Format the number with proper separators
  const formattedAmount = formatNumber(amount, {
    decimals: currency.decimals,
    thousandsSeparator: currency.thousandsSeparator,
    decimalSeparator: currency.decimalSeparator,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  // Build the formatted string
  let result = formattedAmount;
  
  if (showSymbol) {
    if (currency.symbolPosition === 'before') {
      result = `${currency.symbol}${result}`;
    } else {
      result = `${result}${currency.symbol}`;
    }
  }
  
  if (showCode) {
    result = `${result} ${currency.code}`;
  }
  
  return result;
}

/**
 * Format number with separators
 */
export function formatNumber(
  amount: number,
  options: {
    decimals?: number;
    thousandsSeparator?: string;
    decimalSeparator?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    decimals = 2,
    thousandsSeparator = ',',
    decimalSeparator = '.',
    minimumFractionDigits = 0,
    maximumFractionDigits = decimals,
  } = options;

  // Handle invalid numbers
  if (isNaN(amount) || !isFinite(amount)) {
    return '0';
  }

  // Use Intl.NumberFormat for proper formatting
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  let formatted = formatter.format(amount);
  
  // Replace default separators if needed
  if (thousandsSeparator !== ',') {
    formatted = formatted.replace(/,/g, thousandsSeparator);
  }
  
  if (decimalSeparator !== '.') {
    formatted = formatted.replace(/\./g, decimalSeparator);
  }
  
  return formatted;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string, currencyCode: string = 'INR'): number {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  
  // Remove currency symbol and code
  let cleanValue = value
    .replace(currency.symbol, '')
    .replace(currency.code, '')
    .trim();
  
  // Replace separators
  cleanValue = cleanValue
    .replace(new RegExp(`\\${currency.thousandsSeparator}`, 'g'), '')
    .replace(new RegExp(`\\${currency.decimalSeparator}`, 'g'), '.');
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format price range
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currencyCode: string = 'INR'
): string {
  if (minPrice === maxPrice) {
    return formatCurrency(minPrice, currencyCode);
  }
  
  return `${formatCurrency(minPrice, currencyCode)} - ${formatCurrency(maxPrice, currencyCode)}`;
}

/**
 * Format discount percentage
 */
export function formatDiscount(originalPrice: number, discountedPrice: number): string {
  if (originalPrice <= discountedPrice) {
    return '';
  }
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(discount)}% OFF`;
}

/**
 * Calculate discount amount
 */
export function calculateDiscountAmount(originalPrice: number, discountedPrice: number): number {
  return Math.max(0, originalPrice - discountedPrice);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.max(0, ((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Format savings amount
 */
export function formatSavings(
  originalPrice: number,
  discountedPrice: number,
  currencyCode: string = 'INR'
): string {
  const savings = calculateDiscountAmount(originalPrice, discountedPrice);
  if (savings <= 0) return '';
  
  return `You save ${formatCurrency(savings, currencyCode)}`;
}

/**
 * Check if price is valid
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && isFinite(price) && price >= 0;
}

/**
 * Round price to currency decimals
 */
export function roundPrice(price: number, currencyCode: string = 'INR'): number {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const multiplier = Math.pow(10, currency.decimals);
  return Math.round(price * multiplier) / multiplier;
}

/**
 * Convert price between currencies (mock implementation)
 * In a real app, you would use exchange rates from an API
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate?: number
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Mock exchange rates (in a real app, fetch from API)
  const mockRates: Record<string, Record<string, number>> = {
    INR: { USD: 0.012, EUR: 0.011 },
    USD: { INR: 83.0, EUR: 0.92 },
    EUR: { INR: 90.0, USD: 1.09 },
  };
  
  const rate = exchangeRate || mockRates[fromCurrency]?.[toCurrency] || 1;
  return roundPrice(amount * rate, toCurrency);
}

/**
 * Format compact currency (e.g., 1.2K, 1.5M)
 */
export function formatCompactCurrency(
  amount: number,
  currencyCode: string = 'INR'
): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  
  const formatCompact = (num: number): string => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const compactAmount = formatCompact(amount);
  
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${compactAmount}`;
  } else {
    return `${compactAmount}${currency.symbol}`;
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCIES[currencyCode]?.symbol || '₹';
}

/**
 * Get currency name
 */
export function getCurrencyName(currencyCode: string): string {
  return CURRENCIES[currencyCode]?.name || 'Indian Rupee';
}

/**
 * Get supported currencies
 */
export function getSupportedCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCIES);
}