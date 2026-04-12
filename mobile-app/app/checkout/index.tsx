import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useCartStore } from '../../src/store/useCartStore';
import { useOrderStore, PaymentMethod } from '../../src/store/useOrderStore';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const { items, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + (item.offerPrice * item.quantity), 0);
  const deliveryFee = subtotal >= 500 ? 0 : 40;

  const [form, setForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '', city: 'Mysore', state: 'Karnataka', pincode: ''
  });
  const [payment, setPayment] = useState<PaymentMethod>('cod');

  const onCheckout = () => {
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.pincode) {
      alert("Please fill all required fields");
      return;
    }

    placeOrder({
      items: items.map(i => ({ 
        productId: i.id, name: i.name, image: i.image, farmer: i.farmer, quantity: i.quantity, price: i.offerPrice, unit: i.unit 
      })),
      address: form,
      paymentMethod: payment,
      subtotal
    });

    clearCart();
    alert("Order Placed Successfully!");
    router.replace('/orders');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      <Text style={styles.title}>Checkout</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <TextInput style={styles.input} placeholder="Full Name *" value={form.fullName} onChangeText={t => setForm({...form, fullName: t})} />
        <TextInput style={styles.input} placeholder="Phone *" keyboardType="phone-pad" value={form.phone} onChangeText={t => setForm({...form, phone: t})} />
        <TextInput style={styles.input} placeholder="Address Line 1 *" value={form.addressLine1} onChangeText={t => setForm({...form, addressLine1: t})} />
        <TextInput style={styles.input} placeholder="Address Line 2" value={form.addressLine2} onChangeText={t => setForm({...form, addressLine2: t})} />
        <TextInput style={styles.input} placeholder="Pincode *" keyboardType="numeric" value={form.pincode} onChangeText={t => setForm({...form, pincode: t})} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentRow}>
          <Pressable style={[styles.paymentBtn, payment === 'cod' && styles.paymentActive]} onPress={() => setPayment('cod')}>
            <Text style={[styles.paymentText, payment === 'cod' && styles.paymentActiveText]}>Cash on Delivery</Text>
          </Pressable>
          <Pressable style={[styles.paymentBtn, payment === 'upi' && styles.paymentActive]} onPress={() => setPayment('upi')}>
            <Text style={[styles.paymentText, payment === 'upi' && styles.paymentActiveText]}>UPI</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}><Text>Subtotal</Text><Text>₹{subtotal}</Text></View>
        <View style={styles.summaryRow}><Text>Delivery Fee</Text><Text>₹{deliveryFee}</Text></View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}><Text style={styles.totalText}>Total</Text><Text style={styles.totalVal}>₹{subtotal + deliveryFee}</Text></View>
      </View>

      <Pressable style={styles.placeBtn} onPress={onCheckout}>
        <Text style={styles.placeBtnText}>Place Order (₹{subtotal + deliveryFee})</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 12 },
  paymentRow: { flexDirection: 'row', gap: 12 },
  paymentBtn: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee', alignItems: 'center', backgroundColor: '#fff' },
  paymentActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  paymentText: { fontWeight: '600', color: '#4b5563' },
  paymentActiveText: { color: '#16a34a' },
  summaryBox: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalText: { fontWeight: 'bold', fontSize: 16 },
  totalVal: { fontWeight: 'bold', fontSize: 18, color: '#16a34a' },
  placeBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center' },
  placeBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
