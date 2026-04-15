import { create } from 'zustand';
import APIClient from '../api/client';
import { getStorage } from './storage';
import { AboutUsContent } from '../constants/aboutUs';

interface AboutUsState {
  content: AboutUsContent | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchContent: () => Promise<void>;
  updateContent: (content: Partial<AboutUsContent>) => Promise<void>;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'mfm_about_us';

export const useAboutUsStore = create<AboutUsState>((set) => ({
  content: null,
  loading: false,
  error: null,

  fetchContent: async () => {
    set({ loading: true, error: null });
    try {
      const content = await APIClient.get<AboutUsContent>('/api/about');
      set({ content, loading: false });
      // Cache in storage
      await getStorage().setItem(STORAGE_KEY, JSON.stringify(content)).catch(console.error);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch about us content';
      set({ error: message, loading: false });
    }
  },

  updateContent: async (updates) => {
    try {
      const response = await APIClient.put<AboutUsContent>('/api/about', updates);
      set({ content: response });
      // Cache in storage
      await getStorage().setItem(STORAGE_KEY, JSON.stringify(response)).catch(console.error);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update about us content';
      set({ error: message });
    }
  },

  hydrate: async () => {
    try {
      // Try to load from storage first
      const stored = await getStorage().getItem(STORAGE_KEY);
      if (stored) {
        set({ content: JSON.parse(stored) });
      }
      // Then fetch fresh from backend in background
      const content = await APIClient.get<AboutUsContent>('/api/about');
      set({ content });
      await getStorage().setItem(STORAGE_KEY, JSON.stringify(content)).catch(console.error);
    } catch (e) {
      console.error('Failed to hydrate about us', e);
    }
  },
}));

// Re-export type for convenience
export type { AboutUsContent };
