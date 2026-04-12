import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, isAuthenticated, hydrate, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>You are not logged in.</Text>
        <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.loginBtnText}>Login / Sign Up</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name: <Text style={styles.value}>{user.name}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{user.email}</Text></Text>
        <Text style={styles.label}>Role: <Text style={styles.value}>{user.role.toUpperCase()}</Text></Text>
      </View>
      
      {user.role === 'admin' && (
        <Pressable style={styles.dashBtn} onPress={() => router.push('/(admin)')}>
          <Text style={styles.dashBtnText}>Go to Admin Dashboard</Text>
        </Pressable>
      )}

      {user.role === 'farmer' && (
        <Pressable style={styles.dashBtn} onPress={() => router.push('/(farmer)')}>
          <Text style={styles.dashBtnText}>Go to Farmer Dashboard</Text>
        </Pressable>
      )}

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fafaf9' },
  infoText: { fontSize: 18, textAlign: 'center', marginBottom: 24, color: '#4b5563' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, color: '#6b7280', marginBottom: 8 },
  value: { fontWeight: '700', color: '#111827' },
  loginBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dashBtn: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  dashBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ef4444', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  logoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
