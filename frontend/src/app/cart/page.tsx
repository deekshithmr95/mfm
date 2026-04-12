'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './cart.module.css';
import { useCartStore, CartItem } from '@/store/useCartStore';
import { useMemo } from 'react';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = useMemo(() => items.reduce((t, i) => t + i.offerPrice * i.quantity, 0), [items]);
  const totalSaved = useMemo(() => items.reduce((t, i) => t + (i.originalPrice - i.offerPrice) * i.quantity, 0), [items]);

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.empty}`}>
          <span className={styles.emptyIcon}>🛒</span>
          <h1 className={styles.emptyTitle}>Your cart is empty</h1>
          <p className={styles.emptyDesc}>Browse our fresh products and add them to your cart.</p>
          <Link href="/products" className={styles.browseBtn}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your Cart</p>
            <h1 className={styles.title}>Order Summary</h1>
          </div>
          <button className={styles.clearBtn} onClick={clearCart}>Clear all</button>
        </div>

        <div className={styles.layout}>
          {/* Items List */}
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImg}>
                  <Image src={item.image} alt={item.name} fill className={styles.itemImage} sizes="100px" />
                </div>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemFarmer}>{item.farmer} · {item.unit}</p>
                  <div className={styles.itemPricing}>
                    <span className={styles.itemOffer}>₹{item.offerPrice}</span>
                    <span className={styles.itemOriginal}>₹{item.originalPrice}</span>
                    <span className={styles.itemDiscount}>{item.discountPercent}% off</span>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.qtyControl}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stock))}
                      disabled={item.quantity >= item.stock}
                    >+</button>
                  </div>
                  <span className={styles.lineTotal}>₹{(item.offerPrice * item.quantity).toFixed(0)}</span>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span className={styles.free}>Free</span>
            </div>
            {totalSaved > 0 && (
              <div className={`${styles.summaryRow} ${styles.savedRow}`}>
                <span>You save</span>
                <span>₹{totalSaved.toFixed(0)}</span>
              </div>
            )}
            <div className={styles.divider}></div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <Link href="/checkout" className={styles.checkoutBtn}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
