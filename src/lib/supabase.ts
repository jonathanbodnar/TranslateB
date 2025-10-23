import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

// Create a singleton Supabase client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
};

// Export the client for direct use
export const supabase = getSupabaseClient();

// Export auth helpers
export const auth = {
  getUser: () => supabase.auth.getUser(),
  getSession: () => supabase.auth.getSession(),
  signInWithPassword: (credentials: { email: string; password: string }) =>
    supabase.auth.signInWithPassword(credentials),
  signUp: (credentials: { email: string; password: string }) =>
    supabase.auth.signUp(credentials),
  signInWithOAuth: (options: { provider: 'google' | 'apple'; options: { redirectTo: string } }) =>
    supabase.auth.signInWithOAuth(options),
  signOut: () => supabase.auth.signOut(),
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
};

// Export database helpers
export const db = {
  from: (table: string) => supabase.from(table),
};

// Type exports
export type { SupabaseClient } from '@supabase/supabase-js';
