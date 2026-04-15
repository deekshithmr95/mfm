import { create } from 'zustand';
import { getStorage } from './storage';
import APIClient from '../api/client';
import { ADMIN_ACCOUNTS } from '../constants/admin';

export type UserRole = 'farmer' | 'consumer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  farm?: string;
  location?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole, farm?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'mfm_auth_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600)); // simulate network

    // 1. Check if this is a backend-provisioned admin account
    const adminAccount = ADMIN_ACCOUNTS[email.toLowerCase()];
    if (adminAccount) {
      const adminUser: User = { ...adminAccount };
      await getStorage().setItem(STORAGE_KEY, JSON.stringify(adminUser));
      // Set the user in the API client for subsequent requests
      APIClient.setUser(adminUser);
      set({ user: adminUser, isAuthenticated: true });
      return { success: true };
    }

    // 2. Check storage for previously signed-up user
    const stored = await getStorage().getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored) as User;
      if (user.email === email) {
        APIClient.setUser(user);
        set({ user, isAuthenticated: true });
        return { success: true };
      }
    }

    // 3. Auto-create a consumer account if no match
    const user: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'consumer',
    };
    await getStorage().setItem(STORAGE_KEY, JSON.stringify(user));
    APIClient.setUser(user);
    set({ user, isAuthenticated: true });
    return { success: true };
  },

  signup: async (name: string, email: string, _password: string, role: UserRole, farm?: string) => {
    await new Promise((r) => setTimeout(r, 600)); // simulate network

    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      farm: role === 'farmer' ? (farm || `${name}'s Farm`) : undefined,
      location: role === 'farmer' ? 'Mysore, Karnataka' : undefined,
    };
    await getStorage().setItem(STORAGE_KEY, JSON.stringify(user));
    APIClient.setUser(user);
    set({ user, isAuthenticated: true });
    return { success: true };
  },

  logout: async () => {
    await getStorage().removeItem(STORAGE_KEY);
    APIClient.setUser(null);
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const stored = await getStorage().getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        APIClient.setUser(user);
        set({ user, isAuthenticated: true });
      }
    } catch (e) {
      console.error('Failed to hydrate auth', e);
    }
  },
}));

