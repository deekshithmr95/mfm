import { create } from 'zustand';
import { Product } from '../types/product';
import { getStorage } from './storage';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'mfm_wishlist';

const saveWishlist = async (items: Product[]) => {
  try {
    await getStorage().setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist', e);
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addToWishlist: (product) => {
    set((s) => {
      if (s.items.some((i) => i.id === product.id)) return s;
      const updated = [...s.items, product];
      saveWishlist(updated);
      return { items: updated };
    });
  },

  removeFromWishlist: (productId) => {
    set((s) => {
      const updated = s.items.filter((i) => i.id !== productId);
      saveWishlist(updated);
      return { items: updated };
    });
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.id === productId);
  },

  toggleWishlist: (product) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = get();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  },

  hydrate: async () => {
    try {
      const stored = await getStorage().getItem(STORAGE_KEY);
      if (stored) {
        set({ items: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to hydrate wishlist', e);
    }
  },
}));
