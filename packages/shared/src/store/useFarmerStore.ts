import { create } from 'zustand';
import APIClient from '../api/client';
import { Product } from '../types/product';
import { FarmerOrder, AVAILABLE_IMAGES } from '../constants/farmer';

interface FarmerState {
  listings: Product[];
  orders: FarmerOrder[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchListings: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addListing: (product: Omit<Product, 'id' | 'farmer' | 'farmerId'>) => Promise<void>;
  updateListing: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: FarmerOrder['status']) => Promise<void>;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  listings: [],
  orders: [],
  loading: false,
  error: null,

  fetchListings: async () => {
    set({ loading: true, error: null });
    try {
      const listings = await APIClient.get<Product[]>('/api/farmer/listings');
      set({ listings, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch listings';
      set({ error: message, loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await APIClient.get<FarmerOrder[]>('/api/farmer/orders');
      set({ orders, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: message, loading: false });
    }
  },

  addListing: async (product) => {
    try {
      const newProduct = await APIClient.post<Product>('/api/products', product);
      set((state) => ({
        listings: [...state.listings, newProduct],
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add listing';
      set({ error: message });
    }
  },

  updateListing: async (id, updates) => {
    try {
      const updated = await APIClient.put<Product>(`/api/products/${id}`, updates);
      set((state) => ({
        listings: state.listings.map((l) => l.id === id ? updated : l),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update listing';
      set({ error: message });
    }
  },

  deleteListing: async (id) => {
    try {
      await APIClient.delete(`/api/products/${id}`);
      set((state) => ({
        listings: state.listings.filter((l) => l.id !== id),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete listing';
      set({ error: message });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await APIClient.put(`/api/orders/${orderId}/status`, { status });
      set((state) => ({
        orders: state.orders.map((o) => o.id === orderId ? { ...o, status } : o),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update order status';
      set({ error: message });
    }
  },
}));

// Re-export types and constants for convenience
export type { FarmerOrder };
export type { FarmerOrderItem } from '../constants/farmer';
export { AVAILABLE_IMAGES };
