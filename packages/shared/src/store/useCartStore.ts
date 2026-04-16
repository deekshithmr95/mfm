import { create } from 'zustand';
import { Product } from '../types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addToCart: (product: Product) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId: string) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((item) => item.id !== productId)
        : state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
    }));
  },

  clearCart: () => set({ items: [] }),
}));
