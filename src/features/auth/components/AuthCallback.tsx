import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api/http';
import { auth } from '../../../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    (async () => {
      try {
        // hydrate session
        await auth.getSession();
        // claim session if present
        const sid = localStorage.getItem('tb_session_id');
        if (sid) {
          try { await apiFetch('/api/auth/claim-session', { method: 'POST', body: JSON.stringify({ session_id: sid }) }); } catch {}
        }
      } finally {
        const params = new URLSearchParams(loc.search);
        const returnTo = params.get('returnTo') || '/';
        navigate(returnTo, { replace: true });
      }
    })();
  }, [loc.search, navigate]);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="glass-card p-6 text-center text-white/80">Finishing sign-in…</div>
    </div>
  );
};

export default AuthCallback;


