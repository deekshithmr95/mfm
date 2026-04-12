import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useCartStore } from '../../src/store/useCartStore';

export default function CartScreen() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + (item.offerPrice * item.quantity), 0);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Shopping Cart ({items.length})</Text>
        
        {items.map(item => (
          <View key={item.id} style={styles.cartItem}>
             <Image source={{ uri: item.image }} style={styles.itemImage} />
             <View style={styles.itemDetails}>
               <Text style={styles.itemName}>{item.name}</Text>
               <Text style={styles.itemPrice}>₹{item.offerPrice}</Text>
               <View style={styles.qtyContainer}>
                 <Pressable style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                   <Text style={styles.qtyBtnText}>-</Text>
                 </Pressable>
                 <Text style={styles.qtyText}>{item.quantity}</Text>
                 <Pressable style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                   <Text style={styles.qtyBtnText}>+</Text>
                 </Pressable>
               </View>
             </View>
          </View>
        ))}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Subtotal: ₹{subtotal}</Text>
          <Pressable style={styles.checkoutBtn} onPress={() => console.log('goto checkout')}>
            <Text style={styles.checkoutBtnText}>Checkout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#6b7280' },
  scrollContent: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { fontSize: 16, color: '#16a34a', fontWeight: 'bold' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  qtyBtn: { width: 32, height: 32, backgroundColor: '#f3f4f6', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  qtyText: { fontSize: 16, fontWeight: '500' },
  summaryBox: { marginTop: 24, padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  summaryText: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  checkoutBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
