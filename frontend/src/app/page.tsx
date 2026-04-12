'use client';

import Link from 'next/link';
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";

export default function Home() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Farm-fresh goodness, delivered</p>
          <h1 className={styles.headline}>
            The finest produce<br />from Mysore&apos;s farms.
          </h1>
          <p className={styles.subheadline}>
            We connect you directly with local farmers so you get the freshest
            organic produce, dairy, and artisanal goods — no middlemen.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/products" className={styles.ctaPrimary}>Browse Products</Link>
            <a href="#how-it-works" className={styles.ctaSecondary}>How it works</a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>50+</span>
              <span className={styles.statLabel}>Local Farmers</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statNum}>200+</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Organic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className={`container ${styles.products}`}>
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.sectionEyebrow}>What&apos;s fresh</p>
            <h2 className={styles.sectionTitle}>Today&apos;s Harvest</h2>
          </div>
          <Link href="/products" className={styles.seeAll}>See all →</Link>
        </div>

        <div className={styles.grid}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonImg}></div>
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonLine} style={{width:'65%',height:20}}></div>
                    <div className={styles.skeletonLine} style={{width:'40%',height:14,marginTop:8}}></div>
                    <div className={styles.skeletonLine} style={{width:'30%',height:24,marginTop:'auto'}}></div>
                  </div>
                </div>
              ))
            : products?.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionTopCenter}>
            <p className={styles.sectionEyebrow}>How it works</p>
            <h2 className={styles.sectionTitle}>Farm to table in 3 simple steps</h2>
          </div>
          <div className={styles.stepsGrid}>
            {[
              { num: '01', icon: '🔍', title: 'Browse & Discover', desc: 'Explore our curated collection of fresh produce, dairy, spices, and artisanal goods from verified local farmers.' },
              { num: '02', icon: '🛒', title: 'Add to Cart & Checkout', desc: 'Select your items, choose your delivery slot, and pay securely via UPI or Cash on Delivery.' },
              { num: '03', icon: '🚚', title: 'Same-Day Delivery', desc: 'Your order is harvested fresh, packed with care, and delivered to your doorstep within hours.' },
            ].map((step) => (
              <div key={step.num} className={styles.stepCard}>
                <span className={styles.stepNum}>{step.num}</span>
                <span className={styles.stepIcon}>{step.icon}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section className={styles.valueStrip}>
        <div className={`container ${styles.valueInner}`}>
          {[
            { icon: '🚜', title: 'Direct from farms', desc: 'No middlemen, fair prices' },
            { icon: '🌿', title: '100% Organic', desc: 'Certified & verified' },
            { icon: '🚚', title: 'Same-day delivery', desc: 'Harvest to doorstep' },
          ].map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.sectionTopCenter}>
            <p className={styles.sectionEyebrow}>Testimonials</p>
            <h2 className={styles.sectionTitle}>What our customers say</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {[
              { name: 'Ananya Sharma', location: 'Vijayanagar, Mysore', text: 'The tomatoes taste like I remember from my grandmother\'s garden. You can really tell the difference from store-bought produce!', rating: 5 },
              { name: 'Vikram Patil', location: 'Saraswathipuram, Mysore', text: 'As a chef, I need the freshest ingredients. MFM delivers consistent quality every single time. The jaggery is outstanding.', rating: 5 },
              { name: 'Meera Reddy', location: 'Kuvempunagar, Mysore', text: 'I love that I can see exactly which farm my food comes from. The transparency and freshness keep me coming back every week.', rating: 5 },
            ].map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {t.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialLocation}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to taste the farm-fresh difference?</h2>
          <p className={styles.ctaDesc}>Join 5,000+ families in Mysore who get their produce delivered fresh from the farm.</p>
          <div className={styles.ctaActions}>
            <Link href="/products" className={styles.ctaBtnPrimary}>Shop Now</Link>
            <Link href="/about" className={styles.ctaBtnSecondary}>Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
