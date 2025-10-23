import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../config/env';

export const API_BASE = API_BASE_URL;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let authHeaders: Record<string, string> = {};
  
  // Check if Authorization header was explicitly provided in options
  const hasExplicitAuth = options.headers && 
    (options.headers as any)['Authorization'];
  
  // Only fetch token from session if not explicitly provided
  if (!hasExplicitAuth) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Silently fail if auth is not available
    }
  }

  // Merge headers: explicit headers from options take precedence
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...(options.headers as Record<string, string>), // options.headers takes precedence
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: finalHeaders
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  
  return res.json();
}

