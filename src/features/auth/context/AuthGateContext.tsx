import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { auth } from '../../../lib/supabase';
import { trackAnalyticsEvent } from '../../analytics/api/analyticsTracker';
import { ANALYTICS_EVENTS } from '../../../config/analyticsEvents';

type AuthGateContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isUserLoggedIn: boolean;
  user: any;
  loading: boolean;
  isAdmin: boolean;
};

const AuthGateContext = createContext<AuthGateContextValue | undefined>(undefined);

export const AuthGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthStateChange = useCallback((event: string, session: any) => {
    if (event === 'SIGNED_IN') {
      trackAnalyticsEvent(ANALYTICS_EVENTS.AUTH_COMPLETED, { 
        provider: session?.user?.app_metadata?.provider,
        success: true,
        user_id: session?.user?.id 
      }, session?.user?.id);
    } else if (event === 'SIGNED_OUT') {
      trackAnalyticsEvent(ANALYTICS_EVENTS.AUTH_COMPLETED, { success: false });
    }
    
    setUser(session?.user || null);
    setIsUserLoggedIn(!!session?.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        const { data: { user } } = await auth.getUser();
        setUser(user);
        setIsUserLoggedIn(!!user);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
        setIsUserLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(handleAuthStateChange);

    return () => subscription.unsubscribe();
  }, [handleAuthStateChange]);

  const value = useMemo<AuthGateContextValue>(() => {
    // Check if user is admin
    const isAdmin = user?.user_metadata?.role === 'admin' || 
                    (user as any)?.raw_user_meta_data?.role === 'admin';
    
    return {
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isUserLoggedIn,
      user,
      loading,
      isAdmin
    };
  }, [isOpen, isUserLoggedIn, user, loading]);

  return (
    <AuthGateContext.Provider value={value}>
      {children}
    </AuthGateContext.Provider>
  );
};

export function useAuthGate(): AuthGateContextValue {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error('useAuthGate must be used within AuthGateProvider');
  return ctx;
}


