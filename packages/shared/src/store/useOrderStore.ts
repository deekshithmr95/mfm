import { create } from 'zustand';
import { getStorage } from './storage';

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  farmer: string;
  quantity: number;
  price: number;
  unit: string;
}

export type PaymentMethod = 'upi' | 'cod';
export type OrderStatus = 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  items: OrderItem[];
  address: OrderAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
}

interface OrderState {
  orders: Order[];
  placeOrder: (data: {
    items: OrderItem[];
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    subtotal: number;
  }) => Order;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'mfm_orders';

const saveOrders = async (orders: Order[]) => {
  try {
    await getStorage().setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],

  placeOrder: (data) => {
    const deliveryFee = data.subtotal >= 500 ? 0 : 40;
    const order: Order = {
      id: `MFM-${Date.now().toString(36).toUpperCase()}`,
      items: data.items,
      address: data.address,
      paymentMethod: data.paymentMethod,
      subtotal: data.subtotal,
      deliveryFee,
      total: data.subtotal + deliveryFee,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 86400000).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'short',
      }),
    };
    const updated = [order, ...get().orders];
    saveOrders(updated);
    set({ orders: updated });
    return order;
  },

  hydrate: async () => {
    try {
      const stored = await getStorage().getItem(STORAGE_KEY);
      if (stored) {
        set({ orders: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to hydrate orders', e);
    }
  },
}));
