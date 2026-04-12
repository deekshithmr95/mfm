/**
 * Platform-agnostic storage adapter.
 *
 * Web: wraps localStorage (sync → async)
 * Mobile: wraps AsyncStorage (already async)
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/** In-memory fallback — data is lost on app restart */
class MemoryStorage implements StorageAdapter {
  private data = new Map<string, string>();

  async getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  async setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  async removeItem(key: string) {
    this.data.delete(key);
  }
}

let _storage: StorageAdapter = new MemoryStorage();

/**
 * Call once at app startup (before any store hydration) to inject the
 * platform-specific storage implementation.
 */
export function initStorage(adapter: StorageAdapter): void {
  _storage = adapter;
}

/** Returns the current storage adapter (defaults to in-memory if not initialised) */
export function getStorage(): StorageAdapter {
  return _storage;
}
