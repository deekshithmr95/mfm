import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useAuthStore, UserRole } from '../src/store/useAuthStore';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('consumer');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) router.replace('/(tabs)');
      } else {
        if (!name) return;
        const res = await signup(name, email, password, role);
        if (res.success) router.replace('/(tabs)');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLogin && (
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>I am a:</Text>
          <View style={styles.roleTabs}>
            <Pressable 
              style={[styles.roleTab, role === 'consumer' && styles.roleActive]}
              onPress={() => setRole('consumer')}
            >
              <Text style={[styles.roleTabText, role === 'consumer' && styles.roleActiveText]}>Consumer</Text>
            </Pressable>
            <Pressable 
              style={[styles.roleTab, role === 'farmer' && styles.roleActive]}
              onPress={() => setRole('farmer')}
            >
              <Text style={[styles.roleTabText, role === 'farmer' && styles.roleActiveText]}>Farmer</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : 
          <Text style={styles.submitBtnText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        }
      </Pressable>

      <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.switchModeBtn}>
        <Text style={styles.switchModeText}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fafaf9' },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#111827' },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 16 },
  roleContainer: { marginBottom: 24 },
  roleLabel: { fontSize: 14, color: '#4b5563', marginBottom: 8, fontWeight: '600' },
  roleTabs: { flexDirection: 'row', gap: 12 },
  roleTab: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  roleActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  roleTabText: { color: '#4b5563', fontWeight: '500' },
  roleActiveText: { color: '#fff', fontWeight: '700' },
  submitBtn: { backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  switchModeBtn: { marginTop: 24, alignItems: 'center' },
  switchModeText: { color: '#16a34a', fontSize: 16, fontWeight: '600' }
});
