import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../api/http';
import { auth } from '../../../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [_isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to exchange OAuth code for session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: sessionData, error: sessionError } = await auth.getSession();
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error('Auth session error:', sessionError);
          return;
        }
        
        // Ensure we have a valid session with token
        if (!sessionData?.session?.access_token) {
          return;
        }
        
        const token = sessionData.session.access_token;
        
        // claim session if present
        const sid = localStorage.getItem('tb_session_id');
        if (sid) {
          try {
            // Check for stored profile data
            const profileKey = `tb_profile_${sid}`;
            const storedProfile = localStorage.getItem(profileKey);
            const profileData = storedProfile ? JSON.parse(storedProfile).profile : null;
            
            // Claim session with explicit token in headers
            await apiFetch('/api/auth/claim-session', { 
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                session_id: sid,
                profile: profileData
              }) 
            });
            
            // Clean up localStorage after successful claim
            if (storedProfile) {
              localStorage.removeItem(profileKey);
            }
          } catch (error) {
            console.error('Failed to claim session:', error);
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
      } finally {
        if (mounted) {
          setIsProcessing(false);
          const params = new URLSearchParams(loc.search);
          const returnTo = params.get('returnTo') || '/';
          navigate(returnTo, { replace: true });
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, [loc.search, navigate]);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="glass-card p-6 text-center text-white/80">Finishing sign-in…</div>
    </div>
  );
};

export default AuthCallback;


