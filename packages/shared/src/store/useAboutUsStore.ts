import { create } from 'zustand';
import { getStorage } from './storage';
import { AboutUsContent, DEFAULT_ABOUT_CONTENT } from '../constants/aboutUs';

interface AboutUsState {
  content: AboutUsContent;
  updateContent: (content: Partial<AboutUsContent>) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'mfm_about_us';

export const useAboutUsStore = create<AboutUsState>((set) => ({
  content: DEFAULT_ABOUT_CONTENT,

  updateContent: async (updates) => {
    set((s) => {
      const updated = { ...s.content, ...updates };
      getStorage().setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return { content: updated };
    });
  },

  hydrate: async () => {
    try {
      const stored = await getStorage().getItem(STORAGE_KEY);
      if (stored) {
        set({ content: { ...DEFAULT_ABOUT_CONTENT, ...JSON.parse(stored) } });
      }
    } catch (e) {
      console.error('Failed to hydrate about us', e);
    }
  },
}));

// Re-export type for convenience
export type { AboutUsContent };
