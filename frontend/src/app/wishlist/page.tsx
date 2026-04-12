'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useWishlistStore } from '@/store/useWishlistStore';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your Wishlist</p>
            <h1 className={styles.title}>Saved Items</h1>
          </div>
          <span className={styles.count}>{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>❤️</span>
            <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
            <p className={styles.emptyDesc}>Save products you love by clicking the heart icon. They&apos;ll show up here for easy access.</p>
            <Link href="/products" className={styles.browseBtn}>Browse Products</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
