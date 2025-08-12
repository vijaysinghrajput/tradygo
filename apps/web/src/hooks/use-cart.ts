'use client';

import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    storage?: string;
  };
  sellerId: string;
  sellerName: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemsBySeller: () => Record<string, CartItem[]>;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    const { quantity = 1, ...itemData } = item;
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.productId === item.productId && 
               JSON.stringify(i.variant) === JSON.stringify(item.variant)
      );
      
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      
      const newItem: CartItem = {
        ...itemData,
        id: `${item.productId}-${Date.now()}-${Math.random()}`,
        quantity,
      };
      
      return {
        items: [...state.items, newItem],
      };
    });
  },
  
  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  
  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getItemsBySeller: () => {
    const items = get().items;
    return items.reduce((acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = [];
      }
      acc[item.sellerId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  },
}));