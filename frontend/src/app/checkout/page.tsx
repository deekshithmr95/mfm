'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './checkout.module.css';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore, OrderAddress, PaymentMethod } from '@/store/useOrderStore';
import { useToastStore } from '@/store/useToastStore';

type Step = 'address' | 'payment' | 'confirmation';

function QRCodeSVG({ value, size = 200 }: { value: string; size?: number }) {
  // Generate a deterministic QR-like pattern from the value string
  const cells = 21;
  const cellSize = size / cells;
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const pattern: boolean[][] = [];
  for (let r = 0; r < cells; r++) {
    pattern[r] = [];
    for (let c = 0; c < cells; c++) {
      // Position detection patterns (corners)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= cells - 7;
      const isBottomLeft = r >= cells - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const localR = isTopLeft ? r : isBottomLeft ? r - (cells - 7) : r;
        const localC = isTopLeft ? c : isTopRight ? c - (cells - 7) : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6 ||
            (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4)) {
          pattern[r][c] = true;
        } else {
          pattern[r][c] = false;
        }
      } else {
        // Data area — pseudo-random based on seed
        const hash = ((seed * (r + 1) * (c + 1) + r * 7 + c * 13) % 100);
        pattern[r][c] = hash < 45;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.qrCode}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#111"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const addToast = useToastStore((s) => s.addToast);
  const router = useRouter();

  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState<OrderAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [paymentDone, setPaymentDone] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = useMemo(() => items.reduce((t, i) => t + i.offerPrice * i.quantity, 0), [items]);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;
  const totalSaved = useMemo(() => items.reduce((t, i) => t + (i.originalPrice - i.offerPrice) * i.quantity, 0), [items]);

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.empty}`}>
          <span className={styles.emptyIcon}>🛒</span>
          <h1>Your cart is empty</h1>
          <p>Add some products before checking out.</p>
          <Link href="/products" className={styles.browseBtn}>Browse Products</Link>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = () => {
    setPaymentDone(true);
    setTimeout(() => {
      const order = placeOrder({
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          farmer: i.farmer,
          quantity: i.quantity,
          price: i.offerPrice,
          unit: i.unit,
        })),
        address,
        paymentMethod,
        subtotal,
      });
      setOrderId(order.id);
      clearCart();
      setStep('confirmation');
      addToast('Order placed successfully! 🎉');
    }, 2000);
  };

  const steps = [
    { key: 'address', label: 'Delivery' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirmation', label: 'Confirmation' },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Progress Bar */}
        <div className={styles.progress}>
          {steps.map((s, i) => (
            <div key={s.key} className={`${styles.progressStep} ${step === s.key ? styles.progressActive : ''} ${steps.findIndex(x => x.key === step) > i ? styles.progressDone : ''}`}>
              <span className={styles.progressDot}>
                {steps.findIndex(x => x.key === step) > i ? '✓' : i + 1}
              </span>
              <span className={styles.progressLabel}>{s.label}</span>
              {i < steps.length - 1 && <div className={styles.progressLine}></div>}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* ===== ADDRESS STEP ===== */}
            {step === 'address' && (
              <div className={styles.stepCard}>
                <h2 className={styles.stepTitle}>📍 Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Full Name *</label>
                      <input type="text" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required placeholder="Ramesh Gowda" />
                    </div>
                    <div className={styles.formField}>
                      <label>Phone Number *</label>
                      <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className={styles.formField}>
                    <label>Address Line 1 *</label>
                    <input type="text" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} required placeholder="42, MG Road" />
                  </div>
                  <div className={styles.formField}>
                    <label>Address Line 2</label>
                    <input type="text" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} placeholder="Landmark, Floor, etc." />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>City *</label>
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                    </div>
                    <div className={styles.formField}>
                      <label>State *</label>
                      <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                    </div>
                    <div className={styles.formField}>
                      <label>Pincode *</label>
                      <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required placeholder="570001" maxLength={6} />
                    </div>
                  </div>
                  <button type="submit" className={styles.continueBtn}>Continue to Payment →</button>
                </form>
              </div>
            )}

            {/* ===== PAYMENT STEP ===== */}
            {step === 'payment' && (
              <div className={styles.stepCard}>
                <h2 className={styles.stepTitle}>💳 Payment Method</h2>

                <div className={styles.paymentOptions}>
                  <button
                    className={`${styles.paymentOption} ${paymentMethod === 'upi' ? styles.paymentActive : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <span className={styles.paymentIcon}>📱</span>
                    <div>
                      <span className={styles.paymentName}>UPI Payment</span>
                      <span className={styles.paymentDesc}>Pay with Google Pay, PhonePe, Paytm</span>
                    </div>
                    <span className={styles.paymentRadio}>{paymentMethod === 'upi' ? '●' : '○'}</span>
                  </button>

                  <button
                    className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.paymentActive : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <span className={styles.paymentIcon}>💵</span>
                    <div>
                      <span className={styles.paymentName}>Cash on Delivery</span>
                      <span className={styles.paymentDesc}>Pay when your order arrives</span>
                    </div>
                    <span className={styles.paymentRadio}>{paymentMethod === 'cod' ? '●' : '○'}</span>
                  </button>
                </div>

                {/* UPI QR Code */}
                {paymentMethod === 'upi' && !paymentDone && (
                  <div className={styles.qrSection}>
                    <p className={styles.qrInstruction}>Scan the QR code below to pay ₹{total}</p>
                    <div className={styles.qrWrapper}>
                      <QRCodeSVG value={`upi://pay?pa=mysorefm@upi&pn=MysoreMarket&am=${total}`} size={200} />
                      <p className={styles.qrAmount}>₹{total}</p>
                      <p className={styles.qrUpiId}>mysorefm@upi</p>
                    </div>
                    <p className={styles.qrNote}>Or enter UPI ID: <strong>mysorefm@upi</strong></p>
                  </div>
                )}

                {paymentDone && (
                  <div className={styles.paymentProcessing}>
                    <div className={styles.spinner}></div>
                    <p>Processing your payment...</p>
                  </div>
                )}

                <div className={styles.stepActions}>
                  <button className={styles.backBtn} onClick={() => setStep('address')}>← Back</button>
                  <button
                    className={styles.continueBtn}
                    onClick={handlePayment}
                    disabled={paymentDone}
                  >
                    {paymentDone ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Confirm Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* ===== CONFIRMATION STEP ===== */}
            {step === 'confirmation' && (
              <div className={styles.confirmationCard}>
                <div className={styles.confirmIcon}>✅</div>
                <h2 className={styles.confirmTitle}>Order Placed Successfully!</h2>
                <p className={styles.confirmOrder}>Order ID: <strong>{orderId}</strong></p>
                <p className={styles.confirmDesc}>
                  Thank you for your order! Your farm-fresh produce will be delivered by tomorrow.
                  We&apos;ll send you updates via SMS.
                </p>
                <div className={styles.confirmAddress}>
                  <p className={styles.confirmAddressTitle}>Delivering to:</p>
                  <p>{address.fullName}</p>
                  <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                </div>
                <div className={styles.confirmActions}>
                  <Link href="/orders" className={styles.continueBtn}>View My Orders</Link>
                  <Link href="/products" className={styles.secondaryBtn}>Continue Shopping</Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== 'confirmation' && (
            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>Order Summary</h3>
              <div className={styles.sidebarItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.sidebarItem}>
                    <div className={styles.sidebarItemImg}>
                      <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.sidebarItemInfo}>
                      <span className={styles.sidebarItemName}>{item.name}</span>
                      <span className={styles.sidebarItemMeta}>{item.quantity} × ₹{item.offerPrice}</span>
                    </div>
                    <span className={styles.sidebarItemTotal}>₹{item.offerPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className={styles.sidebarDivider}></div>
              <div className={styles.sidebarRow}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className={styles.sidebarRow}>
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? styles.free : ''}>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
              </div>
              {totalSaved > 0 && (
                <div className={`${styles.sidebarRow} ${styles.savedRow}`}>
                  <span>You save</span>
                  <span>₹{totalSaved}</span>
                </div>
              )}
              <div className={styles.sidebarDivider}></div>
              <div className={`${styles.sidebarRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              {subtotal < 500 && (
                <p className={styles.freeDeliveryNote}>Add ₹{500 - subtotal} more for free delivery!</p>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
