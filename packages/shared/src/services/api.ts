import { Product } from '../types/product';
import APIClient from '../api/client';

/**
 * GET /api/products?category=&sort=&q=
 * Fetches all products or featured products based on query
 */
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Fetch featured products - we can use a featured badge filter or just get top products
    const products = await APIClient.get<Product[]>('/api/products?featured=true');
    return products.slice(0, 3); // Return first 3
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
};

/**
 * GET /api/products
 * Fetches all products
 */
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    return await APIClient.get<Product[]>('/api/products');
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    return [];
  }
};

/**
 * GET /api/products/:id
 * Fetches a single product by ID
 */
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    return await APIClient.get<Product>(`/api/products/${id}`);
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return undefined;
  }
};

/**
 * GET /api/products/search?q=...&sort=...&category=...
 * Searches products with filters
 */
export const searchProducts = async (
  query: string = '',
  category: string = '',
  sortBy: string = ''
): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (sortBy) params.append('sort', sortBy);
    const queryString = params.toString();
    return await APIClient.get<Product[]>(
      `/api/products/search${queryString ? '?' + queryString : ''}`
    );
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};
