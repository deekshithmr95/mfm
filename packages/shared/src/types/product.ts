export type ProductBadge = 'seasonal' | 'featured' | 'just_harvested' | 'bestseller' | 'new';

export interface Product {
  id: string;
  name: string;
  farmer: string;
  farmerId: string;
  image: string;
  originalPrice: number;
  offerPrice: number;
  discountPercent: number;
  stock: number;
  category: string;
  unit: string;
  description: string;
  // Farmer & harvest info
  farmerLocation?: string;
  farmerSince?: string;
  farmingMethod?: string;
  certifications?: string[];
  harvestDate?: string;
  shelfLife?: string;
  // Badges
  badges?: ProductBadge[];
  // Ratings
  rating?: number;
  reviewCount?: number;
}
