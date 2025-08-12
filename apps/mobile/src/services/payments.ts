import RazorpayCheckout from 'react-native-razorpay';
import Config from 'react-native-config';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/auth/authStore';

export interface PaymentOptions {
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  notes?: Record<string, string>;
}

export interface PaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentError {
  code: number;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, any>;
}

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  payment: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    method: string;
    order_id: string;
    created_at: string;
  };
}

class PaymentService {
  private razorpayKeyId: string;

  constructor() {
    this.razorpayKeyId = Config.RAZORPAY_KEY_ID || '';
  }

  /**
   * Create a Razorpay order on the server
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await apiClient.post('/payments/orders', request);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create payment order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  /**
   * Open Razorpay checkout
   */
  async openRazorpayCheckout(options: PaymentOptions): Promise<PaymentResult> {
    const user = useAuthStore.getState().user;
    
    const razorpayOptions = {
      description: options.description || 'Payment for order',
      image: 'https://cdn.tradygo.in/logo.png',
      currency: options.currency || 'INR',
      key: this.razorpayKeyId,
      amount: options.amount,
      order_id: options.orderId,
      name: options.name || 'TradyGo',
      prefill: {
        email: options.prefill?.email || user?.email || '',
        contact: options.prefill?.contact || user?.phone || '',
        name: options.prefill?.name || user?.name || '',
      },
      theme: {
        color: '#007AFF',
      },
      notes: options.notes || {},
    };

    return new Promise((resolve, reject) => {
      RazorpayCheckout.open(razorpayOptions)
        .then((data: PaymentResult) => {
          console.log('Payment successful:', data);
          resolve(data);
        })
        .catch((error: PaymentError) => {
          console.error('Payment failed:', error);
          reject(error);
        });
    });
  }

  /**
   * Verify payment on the server
   */
  async verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    try {
      const response = await apiClient.post('/payments/verify', request);
      return response.data;
    } catch (error: any) {
      console.error('Failed to verify payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
  }

  /**
   * Process a complete payment flow
   */
  async processPayment(orderData: {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
    description?: string;
  }): Promise<VerifyPaymentResponse> {
    try {
      // Step 1: Create order on server
      const order = await this.createOrder({
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        notes: orderData.notes,
      });

      // Step 2: Open Razorpay checkout
      const paymentResult = await this.openRazorpayCheckout({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        description: orderData.description,
        notes: orderData.notes,
      });

      // Step 3: Verify payment on server
      const verificationResult = await this.verifyPayment({
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      });

      return verificationResult;
    } catch (error: any) {
      console.error('Payment process failed:', error);
      throw error;
    }
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<any> {
    try {
      const response = await apiClient.get('/payments/methods');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get payment methods:', error);
      throw new Error(error.response?.data?.message || 'Failed to get payment methods');
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(page = 1, limit = 20): Promise<any> {
    try {
      const response = await apiClient.get('/payments/history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to get payment history:', error);
      throw new Error(error.response?.data?.message || 'Failed to get payment history');
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/refund`, {
        amount,
        reason,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to refund payment:', error);
      throw new Error(error.response?.data?.message || 'Failed to refund payment');
    }
  }

  /**
   * Check if Razorpay is available
   */
  isRazorpayAvailable(): boolean {
    return !!this.razorpayKeyId && !!RazorpayCheckout;
  }

  /**
   * Format amount for Razorpay (convert to paise)
   */
  formatAmountForRazorpay(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Format amount from Razorpay (convert from paise)
   */
  formatAmountFromRazorpay(amount: number): number {
    return amount / 100;
  }
}

export const paymentService = new PaymentService();
export default paymentService;

// Payment status constants
export const PAYMENT_STATUS = {
  CREATED: 'created',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

// Payment method constants
export const PAYMENT_METHODS = {
  CARD: 'card',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
  UPI: 'upi',
  EMI: 'emi',
  COD: 'cod',
} as const;

// Currency constants
export const CURRENCIES = {
  INR: 'INR',
  USD: 'USD',
  EUR: 'EUR',
} as const;