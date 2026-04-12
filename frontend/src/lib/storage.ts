import type { StorageAdapter } from '@mfm/shared';

/**
 * Web storage adapter — wraps localStorage with async interface.
 * Used by the shared Zustand stores via initStorage().
 */
export const webStorageAdapter: StorageAdapter = {
  async getItem(key: string) {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  async removeItem(key: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};
