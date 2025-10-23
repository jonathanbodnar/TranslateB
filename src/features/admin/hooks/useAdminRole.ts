import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

/**
 * Hook to check if the current user has admin role
 * @returns Object with isAdmin flag and loading state
 */
export function useAdminRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const role = user.user_metadata?.role;
          setIsAdmin(role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminRole();
  }, []);

  return { isAdmin, loading };
}

