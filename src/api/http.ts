import { createClient } from '@supabase/supabase-js';

export const API_BASE = (process.env.REACT_APP_API_BASE_URL as string) || '/api';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY as string | undefined;
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null as any;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let authHeaders: Record<string, string> = {};
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) authHeaders['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
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

