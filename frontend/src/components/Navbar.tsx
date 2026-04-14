'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState, useMemo } from 'react';

export default function Navbar() {
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const { user, isAuthenticated, logout, hydrate } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    hydrate();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hydrate]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((t, i) => t + i.quantity, 0);
  }, [cartItems]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Hamburger */}
          <button className={styles.hamburger} onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
            <span className={`${styles.hamburgerLine} ${showMobileMenu ? styles.hamburgerOpen : ''}`}></span>
          </button>

          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌾</span>
            <span className={styles.logoText}>Mysore Farmer Market</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/products" className={styles.navLink}>Products</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            {mounted && isAuthenticated && user?.role === 'farmer' && (
              <Link href="/farmer/dashboard" className={styles.navLink}>Dashboard</Link>
            )}
            {mounted && isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className={styles.navLink}>Admin</Link>
            )}
          </nav>

          <div className={styles.actions}>
            {/* Search Toggle */}
            <button className={styles.iconBtn} onClick={() => setShowSearch(!showSearch)} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {mounted && wishlistItems.length > 0 && (
                <span className={styles.badge}>{wishlistItems.length}</span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className={styles.iconBtn} aria-label="Shopping cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 01-8 0"></path>
              </svg>
              {mounted && totalItems > 0 && (
                <span key={totalItems} className={styles.badge}>{totalItems}</span>
              )}
            </Link>

            {/* User */}
            {mounted && isAuthenticated && user ? (
              <div className={styles.userMenu}>
                <button className={styles.userBtn} onClick={() => setShowUserMenu(!showUserMenu)}>
                  <span className={styles.userAvatar}>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </button>
                {showUserMenu && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.name}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                      <span className={styles.dropdownRole}>{user.role}</span>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <Link href="/orders" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                      My Orders
                    </Link>
                    <Link href="/wishlist" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                      Wishlist
                    </Link>
                    {user.role === 'farmer' && (
                      <Link href="/farmer/dashboard" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <div className={styles.dropdownDivider}></div>
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>Log in</Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className={styles.searchBar}>
            <form onSubmit={handleSearch} className={`container ${styles.searchInner}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search products, farmers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" className={styles.searchClose} onClick={() => setShowSearch(false)}>✕</button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={styles.mobileOverlay} onClick={() => setShowMobileMenu(false)}>
          <nav className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <Link href="/products" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>Products</Link>
            <Link href="/about" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>About Us</Link>
            <Link href="/search" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>Search</Link>
            <Link href="/orders" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>My Orders</Link>
            <Link href="/wishlist" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>Wishlist</Link>
            {mounted && isAuthenticated && user?.role === 'farmer' && (
              <Link href="/farmer/dashboard" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>Farmer Dashboard</Link>
            )}
            {mounted && isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>Admin Panel</Link>
            )}
            <div className={styles.mobileDivider}></div>
            {mounted && isAuthenticated ? (
              <button className={styles.mobileLink} onClick={handleLogout}>Log out</button>
            ) : (
              <Link href="/login" className={styles.mobileLink} onClick={() => setShowMobileMenu(false)}>Log in / Sign up</Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
