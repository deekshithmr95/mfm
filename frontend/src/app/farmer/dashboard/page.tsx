'use client';

import styles from './dashboard.module.css';
import { useState, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { useFarmerStore, AVAILABLE_IMAGES, FarmerOrder } from '@/store/useFarmerStore';
import { Product } from '@/types/product';

// ============ PRODUCT FORM MODAL ============
function ProductFormModal({
  initial,
  onClose,
  onSubmit,
  title,
}: {
  initial?: Partial<Product>;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'farmer' | 'farmerId'>) => void;
  title: string;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || 'Vegetables');
  const [unit, setUnit] = useState(initial?.unit || '');
  const [originalPrice, setOriginalPrice] = useState(initial?.originalPrice?.toString() || '');
  const [offerPrice, setOfferPrice] = useState(initial?.offerPrice?.toString() || '');
  const [stock, setStock] = useState(initial?.stock?.toString() || '');
  const [image, setImage] = useState(initial?.image || AVAILABLE_IMAGES[0].value);

  const op = parseFloat(originalPrice) || 0;
  const fp = parseFloat(offerPrice) || 0;
  const discount = op > 0 && fp > 0 && fp < op ? Math.round(((op - fp) / op) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name, description, category, unit, image,
      originalPrice: op, offerPrice: fp,
      discountPercent: discount, stock: parseInt(stock) || 0,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Organic Tomatoes" />
            </div>
            <div className={styles.formField}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Vegetables</option>
                <option>Dairy & Eggs</option>
                <option>Pantry</option>
                <option>Spices</option>
                <option>Fruits</option>
              </select>
            </div>
          </div>

          <div className={styles.formField}>
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe your product..." />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Original Price (₹)</label>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} required min="1" />
            </div>
            <div className={styles.formField}>
              <label>Offer Price (₹)</label>
              <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} required min="1" />
            </div>
            <div className={styles.formField}>
              <label>Discount</label>
              <input type="text" value={discount > 0 ? `${discount}%` : '—'} readOnly className={styles.readonlyField} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Unit</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required placeholder="e.g. 1 kg, 500g, 12 pcs" />
            </div>
            <div className={styles.formField}>
              <label>Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" />
            </div>
          </div>

          <div className={styles.formField}>
            <label>Product Image</label>
            <div className={styles.imageGrid}>
              {AVAILABLE_IMAGES.map((img) => (
                <button type="button" key={img.value}
                  className={`${styles.imagePick} ${image === img.value ? styles.imagePickActive : ''}`}
                  onClick={() => setImage(img.value)}
                >
                  <img src={img.value} alt={img.label} />
                  <span>{img.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>
              {initial ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ ORDER DETAIL MODAL ============
function OrderDetailModal({ order, onClose }: { order: FarmerOrder; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Order ${order.id}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #111; }
        h1 { font-size: 1.5rem; margin-bottom: 4px; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { text-align: left; border-bottom: 2px solid #ddd; padding: 8px 0; font-size: 0.85rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 10px 0; border-bottom: 1px solid #eee; }
        .total-row td { border-top: 2px solid #111; border-bottom: none; font-weight: 700; font-size: 1.1rem; }
        .footer { margin-top: 32px; color: #999; font-size: 0.8rem; text-align: center; }
      </style></head><body>
      ${content.innerHTML}
      <div class="footer">Mysore Farmer Market · Thank you for your order!</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Order {order.id}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div ref={printRef} className={styles.orderDetail}>
          <h1>Order {order.id}</h1>
          <p className={styles.orderMeta}>
            <strong>{order.customer}</strong> · {order.customerPhone}<br/>
            {order.address}<br/>
            Placed: {order.date}
          </p>

          <table className={styles.orderTable}>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
              <tr className={styles.totalTableRow}>
                <td colSpan={3}>Total</td>
                <td>₹{order.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Close</button>
          <button type="button" className={styles.saveBtn} onClick={handlePrint}>🖨 Print Order</button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN DASHBOARD ============
export default function FarmerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { listings, orders, addListing, updateListing, deleteListing, updateOrderStatus } = useFarmerStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'orders'>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<FarmerOrder | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalSales = orders.reduce((t, o) => t + o.total, 0);
  const activeListings = listings.filter((l) => l.stock > 0).length;

  return (
    <ProtectedRoute role="farmer">
      <div className={styles.page}>
        <div className="container">
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className={styles.profileInfo}>
              <h1 className={styles.farmerName}>{user?.name || 'Farmer'}</h1>
              <p className={styles.farmName}>{user?.farm || 'My Farm'} · {user?.location || 'Mysore, Karnataka'}</p>
            </div>
            <button className={styles.addProductBtn} onClick={() => setShowProductForm(true)}>+ Add Product</button>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {(['overview', 'listings', 'orders'] as const).map((tab) => (
              <button key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.statCards}>
                {[
                  { label: 'Total Sales', value: `₹${totalSales.toLocaleString()}`, icon: '💰' },
                  { label: 'Total Orders', value: orders.length.toString(), icon: '📦' },
                  { label: 'Active Listings', value: activeListings.toString(), icon: '🌽' },
                  { label: 'Products', value: listings.length.toString(), icon: '📋' },
                ].map((s) => (
                  <div key={s.label} className={styles.statCard}>
                    <span className={styles.statIcon}>{s.icon}</span>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              <h2 className={styles.sectionTitle}>Recent Orders</h2>
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderRow} onClick={() => setViewingOrder(order)} style={{cursor:'pointer'}}>
                    <div>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.orderCustomer}>{order.customer}</span>
                    </div>
                    <span className={styles.orderItemCount}>{order.items.length} items</span>
                    <span className={styles.orderDate}>{order.date}</span>
                    <span className={styles.orderTotal}>₹{order.total}</span>
                    <span className={`${styles.orderStatus} ${styles[order.status]}`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== LISTINGS ===== */}
          {activeTab === 'listings' && (
            <div className={styles.listingsTable}>
              <div className={styles.tableHeader}>
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {listings.map((item) => (
                <div key={item.id} className={styles.tableRow}>
                  <span className={styles.listingName}>{item.name}</span>
                  <span className={styles.listingPrice}>
                    <span>₹{item.offerPrice}</span>
                    <span className={styles.listingOriginal}>₹{item.originalPrice}</span>
                  </span>
                  <span className={item.stock <= 5 ? styles.lowStock : ''}>{item.stock}</span>
                  <span>
                    <span className={`${styles.statusBadge} ${item.stock > 0 ? styles.statusActive : styles.statusSoldOut}`}>
                      {item.stock > 0 ? 'Active' : 'Sold out'}
                    </span>
                  </span>
                  <span className={styles.rowActions}>
                    <button className={styles.editBtn} onClick={() => setEditingProduct(item)}>Edit</button>
                    {deletingId === item.id ? (
                      <span className={styles.confirmDelete}>
                        Sure?
                        <button onClick={() => { deleteListing(item.id); setDeletingId(null); }} className={styles.confirmYes}>Yes</button>
                        <button onClick={() => setDeletingId(null)} className={styles.confirmNo}>No</button>
                      </span>
                    ) : (
                      <button className={styles.deleteBtn} onClick={() => setDeletingId(item.id)}>Delete</button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ===== ORDERS ===== */}
          {activeTab === 'orders' && (
            <div className={styles.listingsTable}>
              <div className={styles.tableHeader}>
                <span>Order</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Total</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {orders.map((order) => (
                <div key={order.id} className={styles.tableRow}>
                  <span className={styles.listingName}>{order.id}</span>
                  <span>{order.customer}</span>
                  <span>{order.items.length}</span>
                  <span>₹{order.total}</span>
                  <span>
                    <select
                      className={`${styles.statusSelect} ${styles[order.status]}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as FarmerOrder['status'])}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </span>
                  <span className={styles.rowActions}>
                    <button className={styles.editBtn} onClick={() => setViewingOrder(order)}>View</button>
                    <button className={styles.editBtn} onClick={() => { setViewingOrder(order); }}>Print</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showProductForm && (
          <ProductFormModal
            title="Add New Product"
            onClose={() => setShowProductForm(false)}
            onSubmit={(data) => addListing(data)}
          />
        )}

        {editingProduct && (
          <ProductFormModal
            title="Edit Product"
            initial={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSubmit={(data) => updateListing(editingProduct.id, data)}
          />
        )}

        {viewingOrder && (
          <OrderDetailModal
            order={viewingOrder}
            onClose={() => setViewingOrder(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
