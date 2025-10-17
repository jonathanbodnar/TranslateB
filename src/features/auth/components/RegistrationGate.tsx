import React from 'react';
import { createClient } from '@supabase/supabase-js';

type Props = { isOpen: boolean; onClose: () => void };

const RegistrationGate: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const url = (import.meta as any).env.VITE_SUPABASE_URL as string;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = url && key ? createClient(url, key) : null as any;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-card p-6 max-w-md w-full">
        <h3 className="text-white text-lg font-semibold mb-2">Register to Save</h3>
        <p className="text-white/70 text-sm mb-4">Create an account to save translations, take deeper quizzes, and invite contacts.</p>
        <div className="grid gap-2">
          <button
            className="glass-button py-2"
            onClick={async () => { if (supabase) await supabase.auth.signInWithOAuth({ provider: 'google' }); }}
          >
            Continue with Google
          </button>
          <button
            className="glass-button py-2"
            onClick={async () => { if (supabase) await supabase.auth.signInWithOAuth({ provider: 'apple' }); }}
          >
            Continue with Apple
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-3 text-white/60 text-sm">Close</button>
      </div>
    </div>
  );
};

export default RegistrationGate;

