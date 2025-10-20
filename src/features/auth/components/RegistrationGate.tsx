import React, { useState } from 'react';
import { apiFetch } from '../../../api/http';
import { useAuthGate } from '../context/AuthGateContext';
import { auth } from '../../../lib/supabase';

const RegistrationGate: React.FC = () => {
  const { isOpen, close } = useAuthGate();
  const [useEmail, setUseEmail] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  if (!isOpen) return null;
  
  const redirectTo = `${window.location.origin}/auth/callback`;

  const claimSessionIfAny = async () => {
    try {

      const profileKey = JSON.parse(localStorage.getItem('tb_profile') || '{}');
      const sessionId = profileKey.session_id;
      
      // Get current session to get token
      const { data } = await auth.getSession();
      if (!data?.session?.access_token) {
        console.warn('[RegistrationGate] No session token available yet');
        return;
      }
      
      console.log('[RegistrationGate] Session token obtained');
      
      // Check for stored profile
      const storedProfile = localStorage.getItem(profileKey);
      const profileData = storedProfile ? JSON.parse(storedProfile).profile : null;
      
      console.log('[RegistrationGate] Claiming session:', sessionId, 'with profile:', !!profileData);
      
      await apiFetch('/api/auth/claim-session', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          session_id: sessionId,
          profile: profileData
        }) 
      });
      
      console.log('[RegistrationGate] Session claimed successfully');
      
      // Clean up localStorage
      localStorage.removeItem(profileKey);
      console.log('[RegistrationGate] LocalStorage cleaned up');
    } catch (err) {
      console.error('[RegistrationGate] Failed to claim session:', err);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isLogin) {
        const { error: signInErr } = await auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        // Login creates session immediately - claim it
        await claimSessionIfAny();
        close();
      } else {
        const { data, error: signUpErr } = await auth.signUp({ email, password });
        if (signUpErr) throw signUpErr;
        
        // Check if email confirmation is required
        if (data?.user && !data?.session) {
          // No session = email confirmation required
          setError('Please check your email to confirm your account before signing in.');
          setSubmitting(false);
          return;
        }
        
        // Session created immediately (confirmation disabled)
        await claimSessionIfAny();
        close();
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to authenticate');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setShowPassword(false);
  };

  const handleBackToSocial = () => {
    setUseEmail(false);
    resetForm();
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            {useEmail ? (isLogin ? 'Welcome Back' : 'Create Account') : 'Join TranslateB'}
          </h3>
          <p className="text-white/70 text-sm">
            {useEmail 
              ? (isLogin ? 'Sign in to your account' : 'Create an account to save your progress')
              : 'Save translations, take quizzes, and connect with others'
            }
          </p>
        </div>

        {!useEmail ? (
          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 transition-colors py-3 px-4 rounded-lg font-medium"
              onClick={async () => { 
                try {
                  await auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
                } catch (error) {
                  console.error('Google OAuth error:', error);
                  setError('Failed to sign in with Google. Please try again.');
                }
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <button
              className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-800 transition-colors py-3 px-4 rounded-lg font-medium"
              onClick={async () => { 
                try {
                  await auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } });
                } catch (error) {
                  console.error('Apple OAuth error:', error);
                  setError('Failed to sign in with Apple. Please try again.');
                }
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">or</span>
              </div>
            </div>
            
            <button 
              className="w-full glass-button py-3 flex items-center justify-center gap-2"
              onClick={() => setUseEmail(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Continue with Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 text-white placeholder-white/60 rounded-lg pl-10 pr-4 py-3 outline-none border border-white/20 focus:border-white/40 transition-colors"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 11-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 text-white placeholder-white/60 rounded-lg pl-10 pr-12 py-3 outline-none border border-white/20 focus:border-white/40 transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full glass-button py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={handleToggleMode}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="font-medium">{isLogin ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>

            <div className="text-center">
              <button 
                type="button"
                onClick={handleBackToSocial}
                className="text-white/60 hover:text-white text-sm transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to social login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationGate;