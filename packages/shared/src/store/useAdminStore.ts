import { create } from 'zustand';
import { AdminUser, AdminUserRole, UserStatus, MOCK_FARMERS, MOCK_CONSUMERS } from '../constants/admin';

interface AdminState {
  farmers: AdminUser[];
  consumers: AdminUser[];
  updateUserStatus: (id: string, status: UserStatus) => void;
  updateUserNotes: (id: string, notes: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  farmers: MOCK_FARMERS,
  consumers: MOCK_CONSUMERS,

  updateUserStatus: (id, status) => {
    set((s) => ({
      farmers: s.farmers.map((u) => u.id === id ? { ...u, status } : u),
      consumers: s.consumers.map((u) => u.id === id ? { ...u, status } : u),
    }));
  },

  updateUserNotes: (id, notes) => {
    set((s) => ({
      farmers: s.farmers.map((u) => u.id === id ? { ...u, notes } : u),
      consumers: s.consumers.map((u) => u.id === id ? { ...u, notes } : u),
    }));
  },
}));

// Re-export types for convenience
export type { AdminUser, AdminUserRole, UserStatus };
