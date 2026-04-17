'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProduct, useAllProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import ProductCard from '@/components/ProductCard';
import styles from './product-detail.module.css';
import { useState } from 'react';

const BADGE_LABELS: Record<string, string> = {
  seasonal: '🍂 Seasonal Pick',
  featured: '⭐ Featured',
  just_harvested: '🌿 Just Harvested',
  bestseller: '🔥 Bestseller',
  new: '✨ New Arrival',
};

export default function ProductDetail() {
  const params = useParams();
  const id = params.id ? (typeof params.id === 'string' ? params.id : String(params.id)) : '';

  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useAllProducts();
  const addToCart = useCartStore((s) => s.addToCart);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const addToast = useToastStore((s) => s.addToast);
  const [quantity, setQuantity] = useState(1);
  const [now] = useState(() => Date.now());

  // Show loading while waiting for ID or data to load
  const isInitializing = !id || isLoading;

  if (isInitializing) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.skeleton}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonLine} style={{ width: '60%', height: 32 }}></div>
              <div className={styles.skeletonLine} style={{ width: '40%', height: 20 }}></div>
              <div className={styles.skeletonLine} style={{ width: '80%', height: 16 }}></div>
              <div className={styles.skeletonLine} style={{ width: '80%', height: 16 }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.notFound}`}>
          <span className={styles.notFoundIcon}>🔍</span>
          <h1>Product not found</h1>
          <p>The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/products" className={styles.backBtn}>Browse Products</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const lowStock = product.stock <= 5 && product.stock > 0;
  const relatedProducts = allProducts?.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3) || [];
  const allRelated = relatedProducts.length < 3
    ? [...relatedProducts, ...(allProducts?.filter((p) => p.id !== product.id && !relatedProducts.some(r => r.id === p.id)).slice(0, 3 - relatedProducts.length) || [])]
    : relatedProducts;

  const harvestDaysAgo = product.harvestDate
    ? Math.floor((now - new Date(product.harvestDate).getTime()) / 86400000)
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    addToast(`${quantity}× ${product.name} added to cart`);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href="/products">Products</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className={styles.main}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrap}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.productImage}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.badges && product.badges.length > 0 && (
                <div className={styles.imageBadges}>
                  {product.badges.map((badge) => (
                    <span key={badge} className={styles.imageBadge}>{BADGE_LABELS[badge] || badge}</span>
                  ))}
                </div>
              )}
              {product.discountPercent > 0 && (
                <span className={styles.discountTag}>{product.discountPercent}% OFF</span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <div className={styles.categoryTag}>{product.category}</div>
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className={styles.ratingRow}>
                <span className={styles.stars}>
                  {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <span className={styles.ratingNum}>{product.rating}</span>
                {product.reviewCount && (
                  <span className={styles.reviewCount}>{product.reviewCount} reviews</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.offerPrice}>₹{product.offerPrice}</span>
              {product.originalPrice > product.offerPrice && (
                <span className={styles.originalPrice}>₹{product.originalPrice}</span>
              )}
              {product.discountPercent > 0 && (
                <span className={styles.saveBadge}>Save ₹{product.originalPrice - product.offerPrice}</span>
              )}
            </div>

            <p className={styles.unitInfo}>{product.unit}</p>

            {/* Stock */}
            <div className={styles.stockInfo}>
              {product.stock === 0 && <span className={styles.soldOut}>Sold Out</span>}
              {lowStock && <span className={styles.lowStockBadge}>🔥 Only {product.stock} left — order soon!</span>}
              {product.stock > 5 && <span className={styles.inStock}>✓ In Stock</span>}
            </div>

            {/* Harvest Info */}
            {product.harvestDate && (
              <div className={styles.harvestInfo}>
                <span className={styles.harvestIcon}>🌾</span>
                <div>
                  <span className={styles.harvestLabel}>Harvested</span>
                  <span className={styles.harvestValue}>
                    {harvestDaysAgo === 0 ? 'Today' : harvestDaysAgo === 1 ? 'Yesterday' : `${harvestDaysAgo} days ago`}
                    <span className={styles.harvestDate}> ({new Date(product.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})</span>
                  </span>
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className={styles.addToCartRow}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span className={styles.qtyNum}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Sold Out' : `Add to Cart — ₹${product.offerPrice * quantity}`}
              </button>
              <button
                className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
                onClick={() => {
                  toggleWishlist(product);
                  addToast(wishlisted ? 'Removed from wishlist' : `${product.name} saved to wishlist`, wishlisted ? 'info' : 'success');
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <div className={styles.descSection}>
              <h3 className={styles.descTitle}>About this product</h3>
              <p className={styles.descText}>{product.description}</p>
            </div>

            {/* Product Details Grid */}
            <div className={styles.detailsGrid}>
              {product.shelfLife && (
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>📅</span>
                  <span className={styles.detailLabel}>Shelf Life</span>
                  <span className={styles.detailValue}>{product.shelfLife}</span>
                </div>
              )}
              {product.farmingMethod && (
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🌱</span>
                  <span className={styles.detailLabel}>Farming Method</span>
                  <span className={styles.detailValue}>{product.farmingMethod}</span>
                </div>
              )}
              {product.certifications && product.certifications.length > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>✅</span>
                  <span className={styles.detailLabel}>Certifications</span>
                  <span className={styles.detailValue}>{product.certifications.join(', ')}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>📦</span>
                <span className={styles.detailLabel}>Unit Size</span>
                <span className={styles.detailValue}>{product.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Info Card */}
        <section className={styles.farmerSection}>
          <h2 className={styles.sectionTitle}>Meet the Farmer</h2>
          <div className={styles.farmerCard}>
            <div className={styles.farmerAvatar}>
              {product.farmer.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className={styles.farmerInfo}>
              <h3 className={styles.farmerName}>{product.farmer}</h3>
              {product.farmerLocation && (
                <p className={styles.farmerLocation}>📍 {product.farmerLocation}</p>
              )}
              <div className={styles.farmerMeta}>
                {product.farmerSince && (
                  <div className={styles.farmerMetaItem}>
                    <span className={styles.farmerMetaLabel}>Farming Since</span>
                    <span className={styles.farmerMetaValue}>{product.farmerSince}</span>
                  </div>
                )}
                {product.farmingMethod && (
                  <div className={styles.farmerMetaItem}>
                    <span className={styles.farmerMetaLabel}>Method</span>
                    <span className={styles.farmerMetaValue}>{product.farmingMethod}</span>
                  </div>
                )}
                {product.certifications && (
                  <div className={styles.farmerMetaItem}>
                    <span className={styles.farmerMetaLabel}>Certifications</span>
                    <span className={styles.farmerMetaValue}>{product.certifications.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {allRelated.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.sectionTitle}>You might also like</h2>
              <Link href="/products" className={styles.seeAll}>View all →</Link>
            </div>
            <div className={styles.relatedGrid}>
              {allRelated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
