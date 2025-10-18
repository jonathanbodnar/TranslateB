import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../config/env';

export const API_BASE = API_BASE_URL;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let authHeaders: Record<string, string> = {};
  
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) authHeaders['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    // Silently fail if auth is not available
    console.warn('Failed to get auth session:', error);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...authHeaders
    },
    ...options
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  
  return res.json();
}

