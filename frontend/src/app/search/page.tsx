'use client';

import { useSearchParams } from 'next/navigation';
import { useAllProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import styles from './search.module.css';
import { useState, useMemo, Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const { data: products, isLoading } = useAllProducts();

  const results = useMemo(() => {
    if (!products) return [];
    const q = query.toLowerCase().trim();
    if (!q) return products;

    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return filtered;
  }, [products, query, sortBy]);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Search Products</h1>
          <p className={styles.subtitle}>Find fresh produce, dairy, spices, and more</p>
        </div>

        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for organic tomatoes, honey, turmeric..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <div className={styles.toolbar}>
          <span className={styles.resultCount}>
            {query ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"` : `${results.length} products`}
          </span>
          <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton}>
                <div className={styles.skeletonImg}></div>
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonLine} style={{ width: '65%', height: 20 }}></div>
                  <div className={styles.skeletonLine} style={{ width: '40%', height: 14, marginTop: 8 }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className={styles.grid}>
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <h2 className={styles.emptyTitle}>No products found</h2>
            <p className={styles.emptyDesc}>Try searching for something else, like &quot;honey&quot; or &quot;organic&quot;.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
      <SearchContent />
    </Suspense>
  );
}
