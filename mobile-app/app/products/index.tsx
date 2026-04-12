import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAllProducts } from '../../src/hooks/useProducts';
import ProductCard from '../../src/components/ProductCard';

export default function ProductsListScreen() {
  const { data: products, isLoading } = useAllProducts();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={{ width: '50%', padding: 8 }}>
            <ProductCard product={item} />
          </View>
        )}
        numColumns={2}
        ListHeaderComponent={
          <Text style={styles.header}>All Farm Fresh Products</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 8 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 16, paddingHorizontal: 8 }
});
