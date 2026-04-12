'use client';

import styles from './about.module.css';
import { useAboutUsStore } from '@/store/useAboutUsStore';

export default function AboutPage() {
  const { content } = useAboutUsStore();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>About Us</p>
          <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{content.heroSubtitle}</p>
        </div>
      </section>

      {/* Mission */}
      <section className={`container ${styles.section}`}>
        <div className={styles.missionCard}>
          <span className={styles.missionIcon}>🎯</span>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>{content.mission}</p>
        </div>
      </section>

      {/* Story */}
      <section className={`container ${styles.section}`}>
        <p className={styles.storyEyebrow}>Our Story</p>
        <h2 className={styles.sectionTitle}>How it all started</h2>
        <p className={styles.storyText}>{content.story}</p>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <p className={styles.storyEyebrow}>Our Values</p>
          <h2 className={styles.sectionTitle}>What we stand for</h2>
          <div className={styles.valuesGrid}>
            {content.values.map((value, i) => (
              <div key={i} className={styles.valueCard}>
                <span className={styles.valueIcon}>{value.icon}</span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`container ${styles.section}`}>
        <p className={styles.storyEyebrow}>Our Team</p>
        <h2 className={styles.sectionTitle}>The people behind MFM</h2>
        <div className={styles.teamGrid}>
          {content.teamMembers.map((member, i) => (
            <div key={i} className={styles.teamCard}>
              <div className={styles.teamAvatar}>
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamRole}>{member.role}</p>
              <p className={styles.teamBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to taste the difference?</h2>
          <p className={styles.ctaDesc}>Join thousands of Mysore residents who trust us for their daily fresh produce.</p>
          <div className={styles.ctaActions}>
            <a href="/products" className={styles.ctaPrimary}>Browse Products</a>
            <a href="/login" className={styles.ctaSecondary}>Join as a Farmer</a>
          </div>
        </div>
      </section>
    </div>
  );
}
