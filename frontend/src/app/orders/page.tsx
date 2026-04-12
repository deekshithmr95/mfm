'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useOrderStore, Order, OrderStatus } from '@/store/useOrderStore';
import { useState } from 'react';
import styles from './orders.module.css';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  confirmed: { label: 'Confirmed', color: '#3498db', icon: '✓' },
  processing: { label: 'Processing', color: '#f39c12', icon: '📦' },
  shipped: { label: 'Shipped', color: '#9b59b6', icon: '🚚' },
  out_for_delivery: { label: 'Out for Delivery', color: '#e67e22', icon: '🏍️' },
  delivered: { label: 'Delivered', color: '#27ae60', icon: '✅' },
};

const STATUS_STEPS: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

function OrderDetailView({ order, onClose }: { order: Order; onClose: () => void }) {
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Order {order.id}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        {/* Tracking Progress */}
        <div className={styles.tracking}>
          <h3 className={styles.trackingTitle}>Order Status</h3>
          <div className={styles.trackingSteps}>
            {STATUS_STEPS.map((step, i) => {
              const config = STATUS_CONFIG[step];
              const isActive = i <= currentStepIndex;
              return (
                <div key={step} className={`${styles.trackingStep} ${isActive ? styles.trackingActive : ''}`}>
                  <div className={styles.trackingDot}>
                    {isActive ? config.icon : (i + 1)}
                  </div>
                  <span className={styles.trackingLabel}>{config.label}</span>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`${styles.trackingLine} ${i < currentStepIndex ? styles.trackingLineDone : ''}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className={styles.orderItems}>
          <h3 className={styles.orderItemsTitle}>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className={styles.orderItem}>
              <div className={styles.orderItemImg}>
                <Image src={item.image} alt={item.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.orderItemInfo}>
                <span className={styles.orderItemName}>{item.name}</span>
                <span className={styles.orderItemMeta}>{item.farmer} · {item.unit}</span>
              </div>
              <span className={styles.orderItemQty}>{item.quantity}×</span>
              <span className={styles.orderItemPrice}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span><span>₹{order.subtotal}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span><span>₹{order.total}</span>
          </div>
        </div>

        {/* Address */}
        <div className={styles.orderAddress}>
          <h4>Delivery Address</h4>
          <p>{order.address.fullName}</p>
          <p>{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ''}</p>
          <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
          <p>{order.address.phone}</p>
        </div>

        <div className={styles.orderMeta}>
          <span>Payment: {order.paymentMethod === 'upi' ? '📱 UPI' : '💵 Cash on Delivery'}</span>
          <span>Estimated: {order.estimatedDelivery}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Order History</p>
            <h1 className={styles.title}>My Orders</h1>
          </div>
          <span className={styles.count}>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📦</span>
            <h2 className={styles.emptyTitle}>No orders yet</h2>
            <p className={styles.emptyDesc}>When you place your first order, it will appear here.</p>
            <Link href="/products" className={styles.browseBtn}>Start Shopping</Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className={styles.orderCard} onClick={() => setViewingOrder(order)}>
                  <div className={styles.orderCardTop}>
                    <div>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className={styles.statusBadge} style={{ background: config.color }}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <div className={styles.orderCardItems}>
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className={styles.orderCardItemImg}>
                        <Image src={item.image} alt={item.name} fill sizes="40px" style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className={styles.moreItems}>+{order.items.length - 3}</span>
                    )}
                    <span className={styles.orderCardTotal}>₹{order.total}</span>
                  </div>
                  <div className={styles.orderCardFooter}>
                    <span className={styles.orderCardDelivery}>Est. delivery: {order.estimatedDelivery}</span>
                    <span className={styles.viewDetails}>View Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewingOrder && (
        <OrderDetailView order={viewingOrder} onClose={() => setViewingOrder(null)} />
      )}
    </div>
  );
}
