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
        console.log('[AuthCallback] Starting callback processing');
        
        // Wait for Supabase to exchange OAuth code for session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: sessionData, error: sessionError } = await auth.getSession();
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error('[AuthCallback] Session error:', sessionError);
          return;
        }
        
        // Ensure we have a valid session with token
        if (!sessionData?.session?.access_token) {
          console.warn('[AuthCallback] No session token available - email confirmation may be required');
          return;
        }
        
        const token = sessionData.session.access_token;
        console.log('[AuthCallback] Session token obtained');
        
        // Check for tb_profile in localStorage
        const storedProfile = localStorage.getItem('tb_profile');
        console.log('[AuthCallback] tb_profile found:', !!storedProfile);
        
        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile);
            const sessionId = parsed.session_id;
            const profileData = parsed.profile;
            
            console.log('[AuthCallback] Parsed data - sessionId:', sessionId, 'hasProfile:', !!profileData);
            
            // Only claim if we have a valid session_id from a quiz
            if (sessionId) {
              console.log('[AuthCallback] Claiming session:', sessionId);
              
              await apiFetch('/api/auth/claim-session', { 
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  session_id: sessionId,
                  profile: profileData
                }) 
              });
              
              console.log('[AuthCallback] Session claimed successfully');
            } else {
              console.log('[AuthCallback] No session_id in tb_profile, skipping claim');
            }
            
            // Note: We keep tb_profile in localStorage for WIMTS personalization
            // It will be updated when user views their profile page
            console.log('[AuthCallback] tb_profile kept for future use');
          } catch (error) {
            console.error('[AuthCallback] Failed to claim session:', error);
          }
        } else {
          console.log('[AuthCallback] No tb_profile to claim');
        }
      } catch (error) {
        console.error('[AuthCallback] Auth callback error:', error);
      } finally {
        if (mounted) {
          setIsProcessing(false);
          const params = new URLSearchParams(loc.search);
          const returnTo = params.get('returnTo') || '/';
          console.log('[AuthCallback] Redirecting to:', returnTo);
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


