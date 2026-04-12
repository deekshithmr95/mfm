import { Product } from '../types/product';

export interface FarmerOrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface FarmerOrder {
  id: string;
  customer: string;
  customerPhone: string;
  items: FarmerOrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
  address: string;
}

export const AVAILABLE_IMAGES = [
  { label: 'Honey Jar', value: 'https://placehold.co/400x400/FFF8E7/B8860B?text=Honey+Jar' },
  { label: 'Tomatoes', value: 'https://placehold.co/400x400/FFE4E1/DC143C?text=Tomatoes' },
  { label: 'Eggs', value: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=400' },
  { label: 'Jaggery', value: 'https://images.unsplash.com/photo-1579294860002-3920973a0050?auto=format&fit=crop&q=80&w=400' },
  { label: 'Coconut Oil', value: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&q=80&w=400' },
  { label: 'Turmeric', value: 'https://images.unsplash.com/photo-1615485500710-aa71300612ee?auto=format&fit=crop&q=80&w=400' },
];

export const INITIAL_FARMER_LISTINGS: Product[] = [
  { id: 101, name: 'Heirloom Tomatoes', farmer: 'My Farm', farmerId: 'me', image: 'https://placehold.co/400x400/FFE4E1/DC143C?text=Tomatoes', originalPrice: 120, offerPrice: 89, discountPercent: 26, stock: 45, category: 'Vegetables', unit: '1 kg', description: 'Vine-ripened heirloom tomatoes.' },
  { id: 102, name: 'Farm Fresh Eggs', farmer: 'My Farm', farmerId: 'me', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=400', originalPrice: 180, offerPrice: 149, discountPercent: 17, stock: 30, category: 'Dairy & Eggs', unit: '12 pcs', description: 'Free-range eggs.' },
  { id: 103, name: 'Organic Spinach', farmer: 'My Farm', farmerId: 'me', image: 'https://placehold.co/400x400/FFE4E1/DC143C?text=Tomatoes', originalPrice: 45, offerPrice: 35, discountPercent: 22, stock: 20, category: 'Vegetables', unit: '500g', description: 'Fresh organic spinach.' },
  { id: 104, name: 'Green Chillies', farmer: 'My Farm', farmerId: 'me', image: 'https://images.unsplash.com/photo-1615485500710-aa71300612ee?auto=format&fit=crop&q=80&w=400', originalPrice: 30, offerPrice: 25, discountPercent: 17, stock: 0, category: 'Vegetables', unit: '250g', description: 'Hot green chillies.' },
];

export const INITIAL_FARMER_ORDERS: FarmerOrder[] = [
  {
    id: 'ORD-1023', customer: 'Ananya Sharma', customerPhone: '+91 98765 43210',
    items: [
      { productId: 101, name: 'Heirloom Tomatoes', quantity: 2, price: 89 },
      { productId: 102, name: 'Farm Fresh Eggs', quantity: 1, price: 149 },
    ],
    total: 327, date: '2 hours ago', status: 'pending',
    address: '42, MG Road, Mysore 570001'
  },
  {
    id: 'ORD-1022', customer: 'Vikram Patil', customerPhone: '+91 87654 32109',
    items: [{ productId: 102, name: 'Farm Fresh Eggs', quantity: 1, price: 149 }],
    total: 149, date: '5 hours ago', status: 'shipped',
    address: '15, Saraswathipuram, Mysore 570009'
  },
  {
    id: 'ORD-1021', customer: 'Priya Murthy', customerPhone: '+91 76543 21098',
    items: [
      { productId: 101, name: 'Heirloom Tomatoes', quantity: 1, price: 89 },
      { productId: 103, name: 'Organic Spinach', quantity: 2, price: 35 },
    ],
    total: 159, date: 'Yesterday', status: 'delivered',
    address: '8, Vontikoppal, Mysore 570002'
  },
];
