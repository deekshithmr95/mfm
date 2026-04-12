import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageAdapter } from '@mfm/shared';

/**
 * React Native storage adapter — wraps AsyncStorage.
 * Used by the shared Zustand stores via initStorage().
 */
export const mobileStorageAdapter: StorageAdapter = {
  async getItem(key: string) {
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  },
};
