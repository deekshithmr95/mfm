'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import { Product } from '@/types/product';

const BADGE_LABELS: Record<string, { label: string; className: string }> = {
  seasonal: { label: '🍂 Seasonal', className: 'badgeSeasonal' },
  featured: { label: '⭐ Featured', className: 'badgeFeatured' },
  just_harvested: { label: '🌿 Just Harvested', className: 'badgeHarvested' },
  bestseller: { label: '🔥 Bestseller', className: 'badgeBestseller' },
  new: { label: '✨ New', className: 'badgeNew' },
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const addToast = useToastStore((s) => s.addToast);
  const lowStock = product.stock <= 5 && product.stock > 0;
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    addToast(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(
      wishlisted ? `Removed from wishlist` : `${product.name} saved to wishlist`,
      wishlisted ? 'info' : 'success'
    );
  };

  return (
    <Link href={`/products/${product.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imgWrap}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.img}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className={styles.badges}>
              {product.badges.slice(0, 2).map((badge) => {
                const info = BADGE_LABELS[badge];
                return info ? (
                  <span key={badge} className={`${styles.badge} ${styles[info.className]}`}>
                    {info.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
          {product.discountPercent > 0 && (
            <span className={styles.discountBadge}>{product.discountPercent}% off</span>
          )}
          {/* Wishlist */}
          <button
            className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          <div>
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.farmer}>{product.farmer}</p>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className={styles.rating}>
              <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className={styles.ratingNum}>{product.rating}</span>
              {product.reviewCount && (
                <span className={styles.reviewCount}>({product.reviewCount})</span>
              )}
            </div>
          )}

          <div className={styles.meta}>
            {lowStock && (
              <span className={styles.stockWarning}>
                Only {product.stock} left
              </span>
            )}
            {!lowStock && product.stock > 0 && (
              <span className={styles.stockOk}>
                In stock
              </span>
            )}
            {product.stock === 0 && (
              <span className={styles.stockWarning}>Sold out</span>
            )}
            <span className={styles.unit}>{product.unit}</span>
          </div>

          <div className={styles.bottom}>
            <div className={styles.pricing}>
              <span className={styles.offerPrice}>₹{product.offerPrice}</span>
              {product.originalPrice > product.offerPrice && (
                <span className={styles.originalPrice}>₹{product.originalPrice}</span>
              )}
            </div>
            <button
              className={styles.addBtn}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label={`Add ${product.name} to cart`}
            >
              {product.stock === 0 ? 'Sold out' : 'Add'}
              {product.stock > 0 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
