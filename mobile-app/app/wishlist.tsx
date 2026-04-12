import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useWishlistStore } from '../src/store/useWishlistStore';
import ProductCard from '../src/components/ProductCard';

export default function WishlistScreen() {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={{ width: '50%', padding: 8 }}>
            <ProductCard product={item} />
          </View>
        )}
        numColumns={2}
        ListHeaderComponent={
          <Text style={styles.header}>My Wishlist</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#6b7280' },
  list: { padding: 8 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 16, paddingHorizontal: 8 }
});
