import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Cart, CartItem, Product, ProductVariant } from '@/api/endpoints';
import { cartApi } from '@/api/endpoints';

const cartStorage = new MMKV({ id: 'cart-storage' });

const mmkvStorage = {
  getItem: (name: string) => {
    const value = cartStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    cartStorage.set(name, value);
  },
  removeItem: (name: string) => {
    cartStorage.delete(name);
  },
};

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  // Cart operations
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Local cart operations (for offline support)
  addItemLocally: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateItemLocally: (itemId: string, quantity: number) => void;
  removeItemLocally: (itemId: string) => void;
  clearCartLocally: () => void;
  
  // Coupon operations
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  
  // Utility functions
  getItemCount: () => number;
  getCartTotal: () => number;
  isItemInCart: (productId: string, variantId?: string) => boolean;
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  syncWithServer: () => Promise<void>;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      error: null,

      // Cart operations
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.getCart();
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch cart', isLoading: false });
        }
      },

      addItem: async (productId: string, variantId?: string, quantity = 1) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.addItem({ productId, variantId, quantity });
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to add item', isLoading: false });
          throw error;
        }
      },

      updateItem: async (itemId: string, quantity: number) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.updateItem(itemId, { quantity });
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to update item', isLoading: false });
          throw error;
        }
      },

      removeItem: async (itemId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.removeItem(itemId);
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to remove item', isLoading: false });
          throw error;
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          await cartApi.clearCart();
          set({ cart: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to clear cart', isLoading: false });
          throw error;
        }
      },

      // Local cart operations
      addItemLocally: (product: Product, variant?: ProductVariant, quantity = 1) => {
        const { cart } = get();
        const existingItemIndex = cart?.items.findIndex(
          (item) => item.productId === product.id && item.variantId === variant?.id
        );

        if (existingItemIndex !== undefined && existingItemIndex >= 0 && cart) {
          // Update existing item
          const updatedItems = [...cart.items];
          updatedItems[existingItemIndex].quantity += quantity;
          
          const updatedCart = {
            ...cart,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          };
          
          set({ cart: updatedCart });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `local-${Date.now()}`,
            productId: product.id,
            variantId: variant?.id,
            quantity,
            price: variant?.price || product.price,
            product,
            variant,
          };

          const updatedCart = cart
            ? {
                ...cart,
                items: [...cart.items, newItem],
                total: cart.total + (newItem.price * quantity),
                itemCount: cart.itemCount + quantity,
              }
            : {
                id: 'local-cart',
                items: [newItem],
                total: newItem.price * quantity,
                itemCount: quantity,
              };

          set({ cart: updatedCart });
        }
      },

      updateItemLocally: (itemId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ).filter((item) => item.quantity > 0);

        const updatedCart = {
          ...cart,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };

        set({ cart: updatedCart });
      },

      removeItemLocally: (itemId: string) => {
        const { cart } = get();
        if (!cart) return;

        const updatedItems = cart.items.filter((item) => item.id !== itemId);
        const updatedCart = {
          ...cart,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };

        set({ cart: updatedCart });
      },

      clearCartLocally: () => {
        set({ cart: null });
      },

      // Coupon operations
      applyCoupon: async (code: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.applyCoupon(code);
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to apply coupon', isLoading: false });
          throw error;
        }
      },

      removeCoupon: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartApi.removeCoupon();
          set({ cart: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to remove coupon', isLoading: false });
          throw error;
        }
      },

      // Utility functions
      getItemCount: () => {
        const { cart } = get();
        return cart?.itemCount || 0;
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart?.total || 0;
      },

      isItemInCart: (productId: string, variantId?: string) => {
        const { cart } = get();
        return cart?.items.some(
          (item) => item.productId === productId && item.variantId === variantId
        ) || false;
      },

      getCartItem: (productId: string, variantId?: string) => {
        const { cart } = get();
        return cart?.items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
      },

      // State management
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      syncWithServer: async () => {
        try {
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to sync cart with server:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);