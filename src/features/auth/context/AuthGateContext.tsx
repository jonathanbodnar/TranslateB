import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthGateContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AuthGateContext = createContext<AuthGateContextValue | undefined>(undefined);

export const AuthGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<AuthGateContextValue>(() => ({
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }), [isOpen]);

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


