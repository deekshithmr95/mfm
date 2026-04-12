export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  farm?: string;
  location?: string;
  status: UserStatus;
  createdAt: string;
  notes: string;
  // Enriched stats
  productCount?: number;
  orderCount?: number;
  totalSales?: number;
}

export type AdminUserRole = 'farmer' | 'consumer' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending_onboard';

// Backend-provisioned admin accounts (in production, this comes from Cognito/DB)
export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export const ADMIN_ACCOUNTS: Record<string, AdminAccount> = {
  'admin@mfm.com': {
    id: 'admin-001',
    name: 'Platform Admin',
    email: 'admin@mfm.com',
    role: 'admin',
  },
  'support@mfm.com': {
    id: 'admin-002',
    name: 'Support Team',
    email: 'support@mfm.com',
    role: 'admin',
  },
};

export const MOCK_FARMERS: AdminUser[] = [
  { id: 'f-1', name: 'Ramesh Gowda', email: 'ramesh@farm.com', phone: '+91 98765 43210', role: 'farmer', farm: 'Green Valley Fields', location: 'Mysore, Karnataka', status: 'active', createdAt: '2024-01-15', notes: '', productCount: 4, orderCount: 127, totalSales: 48500 },
  { id: 'f-2', name: 'Lakshmi Devi', email: 'lakshmi@agro.com', phone: '+91 87654 32109', role: 'farmer', farm: 'Chamundi Agro', location: 'Nanjangud, Karnataka', status: 'active', createdAt: '2024-03-22', notes: '', productCount: 2, orderCount: 45, totalSales: 12300 },
  { id: 'f-3', name: 'Suresh Patil', email: 'suresh@organics.com', phone: '+91 76543 21098', role: 'farmer', farm: 'Nanjangud Farms', location: 'T. Narasipura, Karnataka', status: 'pending_onboard', createdAt: '2024-06-10', notes: 'Needs help setting up product listings. Called on June 12.', productCount: 0, orderCount: 0, totalSales: 0 },
  { id: 'f-4', name: 'Govinda Rao', email: 'govinda@fields.com', phone: '+91 65432 10987', role: 'farmer', farm: 'Mysore Apiaries', location: 'H.D. Kote, Karnataka', status: 'active', createdAt: '2024-02-05', notes: 'Premium honey producer.', productCount: 1, orderCount: 89, totalSales: 29800 },
];

export const MOCK_CONSUMERS: AdminUser[] = [
  { id: 'c-1', name: 'Ananya Sharma', email: 'ananya@mail.com', phone: '+91 98765 11111', role: 'consumer', status: 'active', createdAt: '2024-04-01', notes: '', orderCount: 12 },
  { id: 'c-2', name: 'Vikram Patil', email: 'vikram@mail.com', phone: '+91 87654 22222', role: 'consumer', status: 'active', createdAt: '2024-05-15', notes: '', orderCount: 8 },
  { id: 'c-3', name: 'Priya Murthy', email: 'priya@mail.com', phone: '+91 76543 33333', role: 'consumer', status: 'suspended', createdAt: '2024-02-20', notes: 'Account suspended due to payment disputes.', orderCount: 3 },
  { id: 'c-4', name: 'Deepak Kumar', email: 'deepak@mail.com', phone: '+91 65432 44444', role: 'consumer', status: 'active', createdAt: '2024-07-01', notes: '', orderCount: 1 },
  { id: 'c-5', name: 'Meera Reddy', email: 'meera@mail.com', phone: '+91 54321 55555', role: 'consumer', status: 'active', createdAt: '2024-03-10', notes: 'Loyal customer, orders weekly.', orderCount: 34 },
];
