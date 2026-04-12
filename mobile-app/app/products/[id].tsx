import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProduct } from '../../src/hooks/useProducts';
import { useCartStore } from '../../src/store/useCartStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(Number(id));
  const { addToCart } = useCartStore();

  if (isLoading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.details}>
          <Text style={styles.farmer}>{product.farmer}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.offerPrice}>₹{product.offerPrice}</Text>
            {product.originalPrice > product.offerPrice && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
            <Text style={styles.unit}> / {product.unit}</Text>
          </View>
          
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaText}>📍 <Text style={{fontWeight: 'bold'}}>Location:</Text> {product.farmerLocation}</Text>
            <Text style={styles.metaText}>🌿 <Text style={{fontWeight: 'bold'}}>Method:</Text> {product.farmingMethod}</Text>
            <Text style={styles.metaText}>⏱ <Text style={{fontWeight: 'bold'}}>Shelf Life:</Text> {product.shelfLife}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.addToCartBtn} onPress={() => addToCart(product)}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  image: { width: '100%', height: 350, backgroundColor: '#f3f4f6' },
  details: { padding: 24 },
  farmer: { fontSize: 14, color: '#16a34a', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 16 },
  priceContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 24 },
  offerPrice: { fontSize: 32, fontWeight: '800', color: '#16a34a' },
  originalPrice: { fontSize: 20, color: '#9ca3af', textDecorationLine: 'line-through', marginBottom: 4 },
  unit: { fontSize: 16, color: '#6b7280', marginBottom: 6 },
  descriptionLabel: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#111827' },
  description: { fontSize: 16, lineHeight: 24, color: '#4b5563', marginBottom: 24 },
  metaBox: { backgroundColor: '#fafaf9', padding: 16, borderRadius: 12, gap: 12 },
  metaText: { fontSize: 15, color: '#374151' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#e5e7eb' },
  addToCartBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
