import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Product } from '../types/product';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Pressable style={({ pressed }) => [
      styles.card,
      pressed && styles.cardPressed
    ]}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {product.badges && product.badges.length > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {product.badges[0].replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.farmerText}>{product.farmer}</Text>
        <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.offerPrice}>₹{product.offerPrice}</Text>
          {product.originalPrice > product.offerPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
    width: 280,
    marginRight: 16,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  farmerText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
});
