'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>🌾</span>
              <span className={styles.logoText}>Mysore Farmer Market</span>
            </Link>
            <p className={styles.tagline}>
              Farm-fresh produce delivered directly from local farmers to your doorstep. No middlemen, no compromise.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <Link href="/products" className={styles.footerLink}>All Products</Link>
            <Link href="/about" className={styles.footerLink}>About Us</Link>
            <Link href="/wishlist" className={styles.footerLink}>Wishlist</Link>
            <Link href="/orders" className={styles.footerLink}>My Orders</Link>
          </div>

          {/* For Farmers */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>For Farmers</h4>
            <Link href="/login" className={styles.footerLink}>Sell on MFM</Link>
            <Link href="/farmer/dashboard" className={styles.footerLink}>Farmer Dashboard</Link>
            <a href="#" className={styles.footerLink}>Pricing</a>
            <a href="#" className={styles.footerLink}>Success Stories</a>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact Us</h4>
            <p className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              Devaraja Market Road, Mysore 570001
            </p>
            <p className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              +91 98765 43210
            </p>
            <p className={styles.contactItem}>
              <span className={styles.contactIcon}>✉️</span>
              hello@mysorefm.com
            </p>
            <p className={styles.contactItem}>
              <span className={styles.contactIcon}>🕐</span>
              Mon–Sat, 6 AM – 8 PM
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Mysore Farmer Market. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Service</a>
            <a href="#" className={styles.bottomLink}>Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
