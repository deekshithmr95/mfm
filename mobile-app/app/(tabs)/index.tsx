import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFeaturedProducts } from '../../src/hooks/useProducts';
import ProductCard from '../../src/components/ProductCard';

export default function Home() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>Farm-fresh goodness, delivered</Text>
          <Text style={styles.headline}>The finest produce{'\n'}from Mysore's farms.</Text>
          <Text style={styles.subheadline}>
            We connect you directly with local farmers so you get the freshest
            organic produce, dairy, and artisanal goods — no middlemen.
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>50+</Text>
              <Text style={styles.statLabel}>Local Farmers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>200+</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>100%</Text>
              <Text style={styles.statLabel}>Organic</Text>
            </View>
          </View>
        </View>

        {/* Today's Harvest */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>What's fresh</Text>
              <Text style={styles.sectionHeadline}>Today's Harvest</Text>
            </View>
            <Text style={styles.seeAll}>See all →</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsList}>
              {products?.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionEyebrow}>How it works</Text>
          <Text style={styles.sectionHeadline}>Farm to table in 3 simple steps</Text>

          {[
            { num: '01', icon: '🔍', title: 'Browse & Discover', desc: 'Explore our curated collection of fresh produce from verified local farmers.' },
            { num: '02', icon: '🛒', title: 'Add to Cart & Checkout', desc: 'Select your items, choose your delivery slot, and pay securely.' },
            { num: '03', icon: '🚚', title: 'Same-Day Delivery', desc: 'Your order is harvested fresh, packed with care, and delivered.' },
          ].map((step) => (
            <View key={step.num} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNum}>{step.num}</Text>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafaf9', // Light warm gray background
  },
  container: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 44,
    marginBottom: 16,
  },
  subheadline: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    borderTopWidth: 1,
    borderColor: '#f3f4f6',
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16a34a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  productsSection: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionEyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionHeadline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  productsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  howItWorksSection: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: 24,
  },
  stepCard: {
    backgroundColor: '#fafaf9',
    padding: 24,
    borderRadius: 24,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f5f5f4',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#d1d5db',
  },
  stepIcon: {
    fontSize: 32,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
});
