import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedProducts, fetchAllProducts, fetchProductById } from '../services/api';
import { Product } from '../types/product';

export function useFeaturedProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });
}

// Updated to use string ID (backend uses UUIDs/string IDs)
export function useProduct(id: string) {
  return useQuery<Product | undefined, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id, // Don't fetch if no ID provided
  });
}
