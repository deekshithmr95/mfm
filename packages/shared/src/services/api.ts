import { Product } from '../types/product';
import { MOCK_PRODUCTS } from '../constants/products';

/**
 * Simulates GET /api/products (featured — first 3)
 */
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS.slice(0, 3)), 800);
  });
};

/**
 * Simulates GET /api/products (all)
 */
export const fetchAllProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS), 600);
  });
};

/**
 * Simulates GET /api/products/:id
 */
export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS.find((p) => p.id === id)), 400);
  });
};
