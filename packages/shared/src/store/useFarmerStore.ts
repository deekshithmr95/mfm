import { create } from 'zustand';
import { Product } from '../types/product';
import { FarmerOrder, AVAILABLE_IMAGES, INITIAL_FARMER_LISTINGS, INITIAL_FARMER_ORDERS } from '../constants/farmer';

interface FarmerState {
  listings: Product[];
  orders: FarmerOrder[];
  addListing: (product: Omit<Product, 'id' | 'farmer' | 'farmerId'>) => void;
  updateListing: (id: number, updates: Partial<Product>) => void;
  deleteListing: (id: number) => void;
  updateOrderStatus: (orderId: string, status: FarmerOrder['status']) => void;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  listings: INITIAL_FARMER_LISTINGS,
  orders: INITIAL_FARMER_ORDERS,

  addListing: (product) => {
    set((state) => ({
      listings: [...state.listings, {
        ...product,
        id: Date.now(),
        farmer: 'My Farm',
        farmerId: 'me',
      }],
    }));
  },

  updateListing: (id, updates) => {
    set((state) => ({
      listings: state.listings.map((l) => l.id === id ? { ...l, ...updates } : l),
    }));
  },

  deleteListing: (id) => {
    set((state) => ({
      listings: state.listings.filter((l) => l.id !== id),
    }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => o.id === orderId ? { ...o, status } : o),
    }));
  },
}));

// Re-export types and constants for convenience
export type { FarmerOrder };
export type { FarmerOrderItem } from '../constants/farmer';
export { AVAILABLE_IMAGES };
