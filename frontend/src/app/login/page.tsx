'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/useAuthStore';
import styles from './login.module.css';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('consumer');
  const [farm, setFarm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        result = await signup(name, email, password, role, farm);
      }

      if (result.success) {
        // Check the actual stored role (admin is assigned from backend, not signup)
        const currentUser = useAuthStore.getState().user;
        const dest = currentUser?.role === 'admin' ? '/admin'
          : mode === 'signup' && role === 'farmer' ? '/farmer/dashboard'
          : '/';
        router.push(dest);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🌾</span>
          <h1 className={styles.title}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className={styles.subtitle}>
            {mode === 'login'
              ? 'Log in to your Mysore Farmer Market account'
              : 'Join as a farmer or consumer'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Gowda"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>I am a</label>
                <div className={styles.roleToggle}>
                  <button
                    type="button"
                    className={`${styles.roleBtn} ${role === 'consumer' ? styles.roleActive : ''}`}
                    onClick={() => setRole('consumer')}
                  >
                    🛒 Consumer
                  </button>
                  <button
                    type="button"
                    className={`${styles.roleBtn} ${role === 'farmer' ? styles.roleActive : ''}`}
                    onClick={() => setRole('farmer')}
                  >
                    🌾 Farmer
                  </button>
                </div>
              </div>

              {role === 'farmer' && (
                <div className={styles.field}>
                  <label className={styles.label}>Farm Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={farm}
                    onChange={(e) => setFarm(e.target.value)}
                    placeholder="Green Valley Fields"
                  />
                </div>
              )}
            </>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className={styles.toggleBtn}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
