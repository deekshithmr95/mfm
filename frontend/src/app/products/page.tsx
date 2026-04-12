'use client';

import styles from './products.module.css';
import ProductCard from '@/components/ProductCard';
import { useAllProducts } from '@/hooks/useProducts';
import { useState } from 'react';

const CATEGORIES = ['All', 'Vegetables', 'Dairy & Eggs', 'Pantry', 'Spices'];

export default function ProductsPage() {
  const { data: products, isLoading } = useAllProducts();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? products
    : products?.filter((p) => p.category === activeCategory);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Browse</p>
            <h1 className={styles.title}>All Products</h1>
          </div>
          <p className={styles.count}>{filtered?.length ?? 0} products</p>
        </div>

        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonImg}></div>
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonLine} style={{width:'65%',height:20}}></div>
                    <div className={styles.skeletonLine} style={{width:'40%',height:14,marginTop:8}}></div>
                  </div>
                </div>
              ))
            : filtered?.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>
    </div>
  );
}
