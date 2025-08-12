import { apiClient, ApiResponse } from './client';
import { User } from '@/auth/authStore';

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface PhoneLoginRequest {
  phone: string;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: Category;
  seller: Seller;
  variants: ProductVariant[];
  attributes: Record<string, any>;
  isActive: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  attributes: Record<string, any>;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
}

export interface Seller {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  logo?: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

// API endpoints
export const authApi = {
  // Email/Password login
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post('/auth/login', data),

  // Phone login (send OTP)
  phoneLogin: (data: PhoneLoginRequest): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/phone/login', data),

  // Verify OTP
  verifyOtp: (data: OtpVerifyRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post('/auth/phone/verify', data),

  // Register
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post('/auth/register', data),

  // Refresh token
  refresh: (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> =>
    apiClient.post('/auth/refresh', { refreshToken }),

  // Logout
  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/logout'),

  // Get current user
  me: (): Promise<ApiResponse<User>> =>
    apiClient.get('/auth/me'),
};

export const productsApi = {
  // Get products with filters
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<{ products: Product[]; total: number; page: number; totalPages: number }>> =>
    apiClient.get('/products', { params }),

  // Get product by ID
  getProduct: (id: string): Promise<ApiResponse<Product>> =>
    apiClient.get(`/products/${id}`),

  // Get product by slug
  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> =>
    apiClient.get(`/products/slug/${slug}`),

  // Search products
  searchProducts: (query: string): Promise<ApiResponse<Product[]>> =>
    apiClient.get('/products/search', { params: { q: query } }),

  // Get categories
  getCategories: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get('/categories'),

  // Check pincode serviceability
  checkPincode: (pincode: string, productId: string): Promise<ApiResponse<{
    serviceable: boolean;
    estimatedDelivery: string;
    shippingCharge: number;
  }>> =>
    apiClient.get(`/products/${productId}/pincode/${pincode}`),
};

export const cartApi = {
  // Get cart
  getCart: (): Promise<ApiResponse<Cart>> =>
    apiClient.get('/cart'),

  // Add item to cart
  addItem: (data: {
    productId: string;
    variantId?: string;
    quantity: number;
  }): Promise<ApiResponse<Cart>> =>
    apiClient.post('/cart/items', data),

  // Update cart item
  updateItem: (itemId: string, data: { quantity: number }): Promise<ApiResponse<Cart>> =>
    apiClient.patch(`/cart/items/${itemId}`, data),

  // Remove cart item
  removeItem: (itemId: string): Promise<ApiResponse<Cart>> =>
    apiClient.delete(`/cart/items/${itemId}`),

  // Clear cart
  clearCart: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete('/cart'),

  // Apply coupon
  applyCoupon: (code: string): Promise<ApiResponse<Cart>> =>
    apiClient.post('/cart/coupon', { code }),

  // Remove coupon
  removeCoupon: (): Promise<ApiResponse<Cart>> =>
    apiClient.delete('/cart/coupon'),
};

export const ordersApi = {
  // Get orders
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; totalPages: number }>> =>
    apiClient.get('/orders', { params }),

  // Get order by ID
  getOrder: (id: string): Promise<ApiResponse<Order>> =>
    apiClient.get(`/orders/${id}`),

  // Create order
  createOrder: (data: {
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethod: string;
  }): Promise<ApiResponse<Order>> =>
    apiClient.post('/orders', data),

  // Cancel order
  cancelOrder: (id: string, reason: string): Promise<ApiResponse<Order>> =>
    apiClient.patch(`/orders/${id}/cancel`, { reason }),

  // Return order
  returnOrder: (id: string, data: {
    reason: string;
    items: { itemId: string; quantity: number }[];
  }): Promise<ApiResponse<Order>> =>
    apiClient.patch(`/orders/${id}/return`, data),
};

export const addressApi = {
  // Get addresses
  getAddresses: (): Promise<ApiResponse<Address[]>> =>
    apiClient.get('/addresses'),

  // Get address by ID
  getAddress: (id: string): Promise<ApiResponse<Address>> =>
    apiClient.get(`/addresses/${id}`),

  // Create address
  createAddress: (data: Omit<Address, 'id'>): Promise<ApiResponse<Address>> =>
    apiClient.post('/addresses', data),

  // Update address
  updateAddress: (id: string, data: Partial<Omit<Address, 'id'>>): Promise<ApiResponse<Address>> =>
    apiClient.patch(`/addresses/${id}`, data),

  // Delete address
  deleteAddress: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/addresses/${id}`),

  // Set default address
  setDefaultAddress: (id: string): Promise<ApiResponse<Address>> =>
    apiClient.patch(`/addresses/${id}/default`),
};

export const paymentsApi = {
  // Create Razorpay order
  createRazorpayOrder: (data: {
    orderId: string;
    amount: number;
  }): Promise<ApiResponse<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    key: string;
  }>> =>
    apiClient.post('/payments/razorpay/create', data),

  // Verify Razorpay payment
  verifyRazorpayPayment: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }): Promise<ApiResponse<{ verified: boolean; order: Order }>> =>
    apiClient.post('/payments/razorpay/verify', data),
};

export const userApi = {
  // Update profile
  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.patch('/users/profile', data),

  // Change password
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> =>
    apiClient.patch('/users/password', data),

  // Upload avatar
  uploadAvatar: (file: FormData): Promise<ApiResponse<{ url: string }>> =>
    apiClient.uploadFile('/users/avatar', file),

  // Register device for push notifications
  registerDevice: (data: {
    deviceId: string;
    fcmToken: string;
    platform: 'ios' | 'android';
  }): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/users/device', data),
};