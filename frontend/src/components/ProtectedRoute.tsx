'use client';

import { useAuthStore, UserRole } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    // Wait a tick for hydration
    const timer = setTimeout(() => {
      const currentUser = useAuthStore.getState();
      if (!currentUser.isAuthenticated) {
        router.push('/login');
        return;
      }
      if (role && currentUser.user?.role !== role) {
        router.push('/');
        return;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, role, router]);

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#777', fontSize: '0.95rem' }}>Checking authentication...</p>
      </div>
    );
  }

  if (role && user?.role !== role) {
    return null;
  }

  return <>{children}</>;
}
