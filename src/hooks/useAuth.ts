// Utility hooks for easier access to auth state
import { useAuthGate } from '../features/auth/context/AuthGateContext';

// Hook to check if user is logged in
export const useIsLoggedIn = () => {
  const { isUserLoggedIn, loading } = useAuthGate();
  return { isLoggedIn: isUserLoggedIn, loading };
};

// Hook to get current user
export const useCurrentUser = () => {
  const { user, loading } = useAuthGate();
  return { user, loading };
};

// Hook to get auth actions
export const useAuthActions = () => {
  const { open, close } = useAuthGate();
  return { openAuthModal: open, closeAuthModal: close };
};

// Hook to get all auth state and actions
export const useAuth = () => {
  return useAuthGate();
};
