import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { useAdminStore } from '../../src/store/useAdminStore';
import { useRouter } from 'expo-router';

export default function AdminDashboardScreen() {
  const { farmers, consumers, updateUserStatus } = useAdminStore();
  const router = useRouter();

  const toggleStatus = (id: string, current: string) => {
    updateUserStatus(id, current === 'active' ? 'suspended' : 'active');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Pressable onPress={() => router.back()}><Text style={styles.goBack}>Go Back</Text></Pressable>
        </View>

        <Text style={styles.sectionTitle}>Farmers</Text>
        {farmers.map((f) => (
          <View key={f.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{f.name}</Text>
              <Text style={[styles.status, f.status === 'active' ? styles.active : styles.suspended]}>
                {f.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.detail}>{f.email} | {f.phone}</Text>
            <Text style={styles.detail}>Farm: {f.farm}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.detail}>Products: {f.productCount}</Text>
              <Text style={styles.detail}>Sales: ₹{f.totalSales}</Text>
            </View>
            <Pressable style={styles.actionBtn} onPress={() => toggleStatus(f.id, f.status)}>
              <Text style={styles.actionBtnText}>{f.status === 'active' ? 'Suspend Account' : 'Activate Account'}</Text>
            </Pressable>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Consumers</Text>
        {consumers.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={[styles.status, c.status === 'active' ? styles.active : styles.suspended]}>
                {c.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.detail}>{c.email} | {c.phone}</Text>
            <Pressable style={styles.actionBtn} onPress={() => toggleStatus(c.id, c.status)}>
               <Text style={styles.actionBtnText}>{c.status === 'active' ? 'Suspend Account' : 'Activate Account'}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafaf9' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold' },
  goBack: { color: '#3b82f6', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, marginTop: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  active: { backgroundColor: '#dcfce7', color: '#16a34a' },
  suspended: { backgroundColor: '#fee2e2', color: '#ef4444' },
  detail: { color: '#4b5563', marginBottom: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionBtn: { marginTop: 12, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center' },
  actionBtnText: { fontWeight: 'bold', color: '#374151' }
});
