import { create } from 'zustand';
import APIClient from '../api/client';
import { AdminUser, AdminUserRole, UserStatus } from '../constants/admin';

interface AdminState {
  farmers: AdminUser[];
  consumers: AdminUser[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchFarmers: () => Promise<void>;
  fetchConsumers: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateUserStatus: (id: string, status: UserStatus) => Promise<void>;
  updateUserNotes: (id: string, notes: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  farmers: [],
  consumers: [],
  loading: false,
  error: null,

  fetchFarmers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await APIClient.get<AdminUser[]>('/api/admin/farmers');
      set({ farmers: response, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch farmers';
      set({ error: message, loading: false });
    }
  },

  fetchConsumers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await APIClient.get<AdminUser[]>('/api/admin/users');
      // Filter consumers from the response
      const consumers = response.filter((u) => u.role === 'consumer');
      set({ consumers, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch consumers';
      set({ error: message, loading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const [farmers, allUsers] = await Promise.all([
        APIClient.get<AdminUser[]>('/api/admin/farmers'),
        APIClient.get<AdminUser[]>('/api/admin/users'),
      ]);
      const consumers = allUsers.filter((u) => u.role === 'consumer');
      set({ farmers, consumers, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      set({ error: message, loading: false });
    }
  },

  updateUserStatus: async (id, status) => {
    try {
      await APIClient.put(`/api/admin/users/${id}`, { status });
      // Update local state
      set((s) => ({
        farmers: s.farmers.map((u) => u.id === id ? { ...u, status } : u),
        consumers: s.consumers.map((u) => u.id === id ? { ...u, status } : u),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user status';
      set({ error: message });
    }
  },

  updateUserNotes: async (id, notes) => {
    try {
      await APIClient.put(`/api/admin/users/${id}`, { notes });
      // Update local state
      set((s) => ({
        farmers: s.farmers.map((u) => u.id === id ? { ...u, notes } : u),
        consumers: s.consumers.map((u) => u.id === id ? { ...u, notes } : u),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user notes';
      set({ error: message });
    }
  },
}));

// Re-export types for convenience
export type { AdminUser, AdminUserRole, UserStatus };
