import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useOrderStore } from '../src/store/useOrderStore';

export default function OrdersScreen() {
  const { orders, hydrate } = useOrderStore();

  useEffect(() => {
    hydrate();
  }, []);

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You have no orders yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.orderStatus}>{item.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.orderDate}>Placed: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.orderTotal}>Total: ₹{item.total}</Text>
            <Text style={styles.itemsLabel}>{item.items.length} items</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#6b7280' },
  list: { padding: 16 },
  orderCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  orderStatus: { fontSize: 14, color: '#16a34a', fontWeight: 'bold' },
  orderDate: { color: '#6b7280', marginBottom: 4 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemsLabel: { color: '#4b5563' }
});
