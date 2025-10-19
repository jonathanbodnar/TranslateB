import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { generateWIMTS, selectWIMTS, WIMTSOption } from '../features/wimts/api/wimtsClient';
import { generateTranslations } from '../features/translator/api/translatorClient';
import { createReflection } from '../features/reflections/api/reflectionsClient';
import { useAuthGate } from '../features/auth/context/AuthGateContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../config/analyticsEvents';
import { getProfile } from '../features/profile/api/profileClient';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const WIMTSPage: React.FC = () => {
  const navigate = useNavigate();
  const q = useQuery();
  const session_id = q.get('session_id') || null;
  const intake_text = q.get('text') || '';
  
  const [options, setOptions] = useState<WIMTSOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ option_id: string; body: string } | null>(null);
  const [mode, setMode] = useState<'4' | '8'>('4');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>('');
  const [tLoading, setTLoading] = useState(false);
  const [savedId, setSavedId] = useState<string>('');
  const { open } = useAuthGate();
  const { track } = useAnalytics();
  const { user } = useAuthGate();
  
  // Single input state - initialized with query param if available
  const [inputText, setInputText] = useState(intake_text);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [wimtsSessionId, setWimtsSessionId] = useState<string | null>(null);
  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const profile = await getProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // Continue without profile data
        }
      }
    };
    fetchProfile();
  }, [user?.id]);

  // Auto-generate if we have query params (came from quiz)
  useEffect(() => {
    if (intake_text && session_id) {
      generateOptions();
    }
  }, []);

  const generateOptions = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    
    // Track WIMTS session start
    track(ANALYTICS_EVENTS.WIMTS_SESSION_STARTED, { 
      session_id: session_id || 'direct_access',
      user_id: user?.id || 'anonymous',
      access_type: session_id ? 'quiz_flow' : 'direct_access',
      has_profile: !!userProfile
    });
    
    try {
      const res = await generateWIMTS(session_id, inputText, userProfile || {});
      setOptions(res.what_i_meant_variants);
      setWimtsSessionId(res.wimts_session_id); // Store the WIMTS session ID
      
      // Track WIMTS options viewed with enhanced context
      res.what_i_meant_variants.forEach(opt => {
        track(ANALYTICS_EVENTS.WIMTS_OPTION_VIEWED, { 
          session_id: session_id || 'direct_access',
          wimts_session_id: res.wimts_session_id,
          user_id: user?.id || 'anonymous',
          option_id: opt.option_id,
          access_type: session_id ? 'quiz_flow' : 'direct_access',
          has_profile: !!userProfile
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (opt: { option_id: string; body: string }) => {
    setSelected(opt);
    setSavedId('');
    
    // Track WIMTS option selected with enhanced context
    track(ANALYTICS_EVENTS.WIMTS_OPTION_SELECTED, { 
      session_id: session_id || 'direct_access',
      wimts_session_id: wimtsSessionId,
      user_id: user?.id || 'anonymous',
      option_id: opt.option_id,
      access_type: session_id ? 'quiz_flow' : 'direct_access',
      has_profile: !!userProfile
    });
    
    // Call selectWIMTS with the wimts_session_id
    await selectWIMTS(session_id, wimtsSessionId, opt.option_id);
    
    setTLoading(true);
    try {
      const res = await generateTranslations(opt.body, mode);
      setTranslations(res.translations);
      const first = Object.keys(res.translations)[0];
      setActive(first);
    } finally {
      setTLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen gradient-primary p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between pt-12 mb-4">
        <button onClick={() => navigate(-1)} className="glass-button p-2 rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold">What I Meant To Say</h1>
        <div className="w-10" />
      </div>
      
      {/* Input form - always visible */}
      <div className="glass-card p-4 mb-4">
        <label className="text-white text-sm font-medium mb-2 block">
          What are you trying to say?
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="I got in a fight with my partner..."
          className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none resize-none h-24 mb-3"
          maxLength={500}
          autoFocus={!intake_text} // Only auto-focus if no query params
          autoComplete="off"
        />
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-xs">
            {inputText.length}/500
          </span>
          <button
            onClick={generateOptions}
            disabled={!inputText.trim() || loading}
            className="glass-button px-4 py-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Options'}
          </button>
        </div>
      </div>
      
      {loading && <div className="text-white/70">Generating options…</div>}

      {!selected && !loading && (
        <div className="space-y-3">
          {options.map((opt) => (
            <div key={opt.option_id} className="glass-card p-4 cursor-pointer" onClick={() => onSelect({ option_id: opt.option_id, body: opt.body })}>
              <div className="text-white/60 text-xs mb-1">{opt.title}</div>
              <div className="text-white text-sm">{opt.body}</div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/80 text-sm">Selected:</div>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded-full text-xs ${mode === '4' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/80'}`} onClick={() => setMode('4')}>4</button>
              <button className={`px-3 py-1 rounded-full text-xs ${mode === '8' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/80'}`} onClick={async () => { setMode('8'); if (selected) { setTLoading(true); try { const res = await generateTranslations(selected.body, '8'); setTranslations(res.translations); const first = Object.keys(res.translations)[0]; setActive(first); } finally { setTLoading(false); } } }}>8</button>
              <button className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80" onClick={() => { setSelected(null); setTranslations({}); setActive(''); }}>Change</button>
              {!intake_text && (
                <button 
                  className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80" 
                  onClick={() => { 
                    setSelected(null); 
                    setTranslations({}); 
                    setActive(''); 
                    setInputText(''); 
                    setOptions([]);
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
          <div className="text-white text-sm mb-4 whitespace-pre-wrap">{selected.body}</div>
          {tLoading && <div className="text-white/70">Generating translations…</div>}
          {!tLoading && (
            <>
              <div className="flex gap-2 mb-3 flex-wrap">
                {Object.keys(translations).map((k) => (
                  <button key={k} onClick={() => { setActive(k); }} className={`px-3 py-1 rounded-full text-sm ${active === k ? 'bg-white/30 text-white' : 'bg-white/10 text-white/80'}`}>
                    {k}
                  </button>
                ))}
              </div>
              <div className="text-white text-sm whitespace-pre-wrap">
                {active && translations[active]}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await createReflection({
                        base_intake_text: inputText,
                        wimts_option_id: selected.option_id,
                        translation_mode: mode,
                        chosen_translation_key: active,
                        translation_text: active ? translations[active] : ''
                      });
                      setSavedId(res.reflection_id);
                    } catch {
                      open();
                    }
                  }}
                  className="glass-button px-4 py-2 text-sm"
                >
                  Save
                </button>
                {savedId && <div className="text-white/70 text-sm">Saved: {savedId}</div>}
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WIMTSPage;