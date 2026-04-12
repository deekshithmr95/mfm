// ── Types ──────────────────────────────────────────────────────────
export type { Product, ProductBadge } from './types/product';

// ── Storage Adapter ────────────────────────────────────────────────
export type { StorageAdapter } from './store/storage';
export { initStorage, getStorage } from './store/storage';

// ── Stores ─────────────────────────────────────────────────────────
export { useCartStore } from './store/useCartStore';
export type { CartItem } from './store/useCartStore';

export { useToastStore } from './store/useToastStore';
export type { Toast, ToastType } from './store/useToastStore';

export { useAdminStore } from './store/useAdminStore';
export type { AdminUser, AdminUserRole, UserStatus } from './store/useAdminStore';

export { useFarmerStore } from './store/useFarmerStore';
export type { FarmerOrder, FarmerOrderItem } from './store/useFarmerStore';
export { AVAILABLE_IMAGES } from './store/useFarmerStore';

export { useAuthStore } from './store/useAuthStore';
export type { User, UserRole } from './store/useAuthStore';

export { useWishlistStore } from './store/useWishlistStore';

export { useOrderStore } from './store/useOrderStore';
export type { Order, OrderItem, OrderAddress, PaymentMethod, OrderStatus } from './store/useOrderStore';

export { useAboutUsStore } from './store/useAboutUsStore';
export type { AboutUsContent } from './store/useAboutUsStore';

// ── Constants ──────────────────────────────────────────────────────
export { MOCK_PRODUCTS } from './constants/products';
export { ADMIN_ACCOUNTS, MOCK_FARMERS, MOCK_CONSUMERS } from './constants/admin';
export { DEFAULT_ABOUT_CONTENT } from './constants/aboutUs';
export { INITIAL_FARMER_LISTINGS, INITIAL_FARMER_ORDERS } from './constants/farmer';

// ── Services ───────────────────────────────────────────────────────
export { fetchFeaturedProducts, fetchAllProducts, fetchProductById } from './services/api';

// ── Hooks ──────────────────────────────────────────────────────────
export { useFeaturedProducts, useAllProducts, useProduct } from './hooks/useProducts';
