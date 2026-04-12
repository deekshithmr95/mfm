import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { useFarmerStore } from '../../src/store/useFarmerStore';
import { useRouter } from 'expo-router';

export default function FarmerDashboardScreen() {
  const { listings, orders, updateOrderStatus, deleteListing } = useFarmerStore();
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Farmer Dashboard</Text>
          <Pressable onPress={() => router.back()}><Text style={styles.goBack}>Go Back</Text></Pressable>
        </View>

        <Text style={styles.sectionTitle}>Active Orders</Text>
        {orders.map((o) => (
          <View key={o.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{o.id}</Text>
              <Text style={styles.date}>{o.date}</Text>
            </View>
            <Text style={styles.detail}>Customer: {o.customer} ({o.customerPhone})</Text>
            <Text style={styles.detail}>Address: {o.address}</Text>
            <Text style={styles.detail}>Total: ₹{o.total}</Text>
            <View style={styles.actionRow}>
              <Text style={styles.statusLabel}>Status: <Text style={styles.statusVal}>{o.status.toUpperCase()}</Text></Text>
              {o.status === 'pending' && (
                <Pressable style={styles.actionBtn} onPress={() => updateOrderStatus(o.id, 'shipped')}>
                  <Text style={styles.actionBtnText}>Mark Shipped</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <Pressable onPress={() => {}}><Text style={styles.goBack}>+ Add New</Text></Pressable>
        </View>
        
        {listings.map((l) => (
          <View key={l.id} style={styles.cardRow}>
            <Image source={{ uri: l.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{l.name}</Text>
              <Text style={styles.detail}>Price: ₹{l.offerPrice}</Text>
              <Text style={styles.detail}>Stock: {l.stock} {l.unit}</Text>
              <Pressable onPress={() => deleteListing(l.id)}>
                <Text style={styles.deleteText}>Delete Listing</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  goBack: { color: '#3b82f6', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  date: { color: '#6b7280', fontSize: 12 },
  detail: { color: '#4b5563', marginBottom: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  statusLabel: { color: '#111827', fontWeight: 'bold' },
  statusVal: { color: '#16a34a' },
  actionBtn: { backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  cardRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#f3f4f6' },
  productDetails: { flex: 1, justifyContent: 'space-between' },
  productName: { fontWeight: 'bold', fontSize: 16 },
  deleteText: { color: '#ef4444', fontWeight: 'bold', marginTop: 8 }
});
