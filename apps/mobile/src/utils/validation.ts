import { z } from 'zod';

/**
 * Common validation schemas
 */

// Phone number validation (Indian format)
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^[+]?[0-9\s-()]+$/, 'Invalid phone number format')
  .transform((val) => val.replace(/[\s-()]/g, '')) // Remove spaces, dashes, parentheses
  .refine((val) => {
    // Indian phone number validation
    const cleanNumber = val.replace(/^\+91/, '').replace(/^91/, '').replace(/^0/, '');
    return cleanNumber.length === 10 && /^[6-9]/.test(cleanNumber);
  }, 'Please enter a valid Indian phone number');

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

// OTP validation
export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only numbers');

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .transform((val) => val.trim());

// Pincode validation (Indian)
export const pincodeSchema = z
  .string()
  .length(6, 'Pincode must be 6 digits')
  .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid pincode');

// Address validation
export const addressSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  addressLine1: z
    .string()
    .min(5, 'Address line 1 must be at least 5 characters')
    .max(100, 'Address line 1 is too long'),
  addressLine2: z
    .string()
    .max(100, 'Address line 2 is too long')
    .optional(),
  landmark: z
    .string()
    .max(50, 'Landmark is too long')
    .optional(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City name is too long'),
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State name is too long'),
  pincode: pincodeSchema,
  isDefault: z.boolean().optional(),
});

// Login schemas
export const phoneLoginSchema = z.object({
  phone: phoneSchema,
});

export const emailLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const otpVerificationSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});

// Registration schema
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema.optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// Search schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .transform((val) => val.trim()),
});

// Review schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  title: z
    .string()
    .min(5, 'Review title must be at least 5 characters')
    .max(100, 'Review title is too long'),
  comment: z
    .string()
    .min(10, 'Review comment must be at least 10 characters')
    .max(500, 'Review comment is too long'),
});

// Coupon code schema
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code is too long')
    .regex(/^[A-Z0-9]+$/, 'Coupon code can only contain uppercase letters and numbers')
    .transform((val) => val.toUpperCase()),
});

/**
 * Validation helper functions
 */

// Validate phone number
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  try {
    phoneSchema.parse(phone);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid phone number' };
  }
}

// Validate email
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  try {
    emailSchema.parse(email);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid email address' };
  }
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check (optional for medium/strong)
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }

  // Length bonus
  if (password.length >= 12) {
    score += 1;
  }

  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

// Validate pincode
export function validatePincode(pincode: string): { isValid: boolean; error?: string } {
  try {
    pincodeSchema.parse(pincode);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid pincode' };
  }
}

/**
 * Validate OTP
 */
export function validateOTP(otp: string): { isValid: boolean; error?: string } {
  try {
    otpSchema.parse(otp);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Invalid OTP' };
  }
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  // Indian format: +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  // International format with country code
  if (cleaned.length > 10) {
    const countryCode = cleaned.slice(0, -10);
    const number = cleaned.slice(-10);
    return `+${countryCode} ${number.slice(0, 5)} ${number.slice(5)}`;
  }
  
  return phone;
}

// Clean phone number (remove formatting)
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Validate form data with schema
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { isValid: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

// Check if string is empty or whitespace
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

// Sanitize string input
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

// Validate file size
export function validateFileSize(sizeInBytes: number, maxSizeInMB: number = 5): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
}

// Validate file type
export function validateFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
}

// Export all schemas for easy access
export const schemas = {
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema,
  name: nameSchema,
  pincode: pincodeSchema,
  address: addressSchema,
  phoneLogin: phoneLoginSchema,
  emailLogin: emailLoginSchema,
  otpVerification: otpVerificationSchema,
  registration: registrationSchema,
  profileUpdate: profileUpdateSchema,
  changePassword: changePasswordSchema,
  search: searchSchema,
  review: reviewSchema,
  coupon: couponSchema,
};