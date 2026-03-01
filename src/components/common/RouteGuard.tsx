'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import authService from '@/features/auth/services/authService';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // If we are already on login or register, don't check auth
      if (pathname === '/login' || pathname === '/register') {
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      // If we already have a user in store, we are good
      if (user || isInitialized) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch {
        // If not authenticated and not on auth pages, redirect to login
        logout();
        if (pathname !== '/login' && pathname !== '/register') {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, [user, setUser, logout, isInitialized, pathname, router]);

  // Prevent flicker on auth pages if already logged in
  useEffect(() => {
    if (!loading && user && (pathname === '/login' || pathname === '/register')) {
      router.push('/');
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
