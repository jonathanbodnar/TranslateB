import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateWIMTS, selectWIMTS, WIMTSOption } from '../features/wimts/api/wimtsClient';
import { generateTranslations } from '../features/translator/api/translatorClient';
import { createReflection } from '../features/reflections/api/reflectionsClient';
import { useAuthGate } from '../features/auth/context/AuthGateContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../config/analyticsEvents';
import { supabase } from '../lib/supabase';
import { getContacts, Contact } from '../features/contacts/api/contactsClient';
import { useAuth } from '../hooks/useAuth';

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
  const [translationKeys, setTranslationKeys] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [tLoading, setTLoading] = useState(false);
  const [savedId, setSavedId] = useState<string>('');
  const { open } = useAuthGate();
  const { track } = useAnalytics();
  const { user } = useAuthGate();
  const authUser = useAuth().user;
  
  // Single input state - initialized with query param if available
  const [inputText, setInputText] = useState(intake_text);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [wimtsSessionId, setWimtsSessionId] = useState<string | null>(null);
  
  // NEW: Contact/Recipient state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [recipientName, setRecipientName] = useState<string | null>(null);
  
  // Load profile from tb_profile or fetch from API
  useEffect(() => {
    const loadProfile = async () => {
      // Check for tb_profile in localStorage
      const storedProfile = localStorage.getItem('tb_profile');
      if (storedProfile) {
        try {
          const { profile } = JSON.parse(storedProfile);
          setUserProfile(profile);
          return;
        } catch (error) {
          console.error('Failed to parse tb_profile:', error);
        }
      }
      
      // If no profile in localStorage and user is logged in, fetch from API
      if (user?.id) {
        try {
          const response = await fetch(`${window.location.origin}/api/profile/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            }
          });
          
          if (response.ok) {
            const fullProfile = await response.json();
            // Extract the cognitive snapshot for WIMTS
            const profileData = {
              lead: fullProfile.cognitive_snapshot.dominant_streams[0] || 'Feeling',
              next: fullProfile.cognitive_snapshot.dominant_streams[1] || 'Intuition',
              mode: 'Inward-led',
              processing_tendencies: fullProfile.cognitive_snapshot.processing_tendencies,
              communication_lens: fullProfile.cognitive_snapshot.communication_lens
            };
            
            // Store in localStorage for future use
            localStorage.setItem('tb_profile', JSON.stringify({
              profile: profileData,
              timestamp: new Date().toISOString()
            }));
            
            setUserProfile(profileData);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch profile from API:', error);
        }
      }
      
      // If no profile and user is not logged in, redirect to quiz
      if (!user) {
        navigate('/?action=start_quiz');
      }
    };
    
    loadProfile();
  }, [user, navigate]);
  
  // NEW: Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      if (!authUser?.id) return;
      
      setLoadingContacts(true);
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };
    
    fetchContacts();
  }, [authUser]);

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
      const res = await generateWIMTS(
        session_id, 
        inputText, 
        userProfile || {}, 
        selectedRecipientId || undefined // Pass recipient_id
      );
      setOptions(res.what_i_meant_variants);
      setWimtsSessionId(res.wimts_session_id);
      
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
      const res = await generateTranslations(opt.body, mode, selectedRecipientId || undefined);
      setTranslations(res.translations);
      const keys = Object.keys(res.translations);
      setTranslationKeys(keys);
      setCurrentCardIndex(0);
      
      // Store recipient name from response
      if (res.recipient) {
        setRecipientName(res.recipient.name);
      } else {
        setRecipientName(null);
      }
      
      // Track analytics for recipient-aware translations
      if (selectedRecipientId) {
        track(ANALYTICS_EVENTS.CONTACT_TRANSLATION_GENERATED, {
          contact_id: selectedRecipientId,
          mode,
          message_length: opt.body.length,
          from_wimts: true,
        });
      }
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
      
      {/* NEW: Contact Selector - Horizontal Scroll Cards */}
      {authUser && (
        <div className="mb-4">
          <label className="block text-sm text-white/70 mb-3 px-1">
            {selectedRecipientId ? '💬 Communicating with:' : '🌐 Select a recipient:'}
          </label>
          <div className="flex gap-3 overflow-visible pb-2 hide-scrollbar">
            {/* General Audience Card */}
            <motion.button
              onClick={() => {
                setSelectedRecipientId(null);
                setRecipientName(null);
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                !selectedRecipientId
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50'
                  : 'glass-card border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !selectedRecipientId ? 'bg-purple-500/40' : 'bg-white/10'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white text-sm font-medium">General</div>
                  <div className="text-white/60 text-xs">Everyone</div>
                </div>
              </div>
            </motion.button>

            {/* Contact Cards */}
            {loadingContacts ? (
              <div className="flex items-center justify-center px-4 py-3 text-white/60 text-sm">
                Loading contacts...
              </div>
            ) : (
              contacts.map((contact) => (
                <motion.button
                  key={contact.id}
                  onClick={() => {
                    setSelectedRecipientId(contact.id);
                    setRecipientName(contact.name);
                  }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                    selectedRecipientId === contact.id
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50'
                      : 'glass-card border border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      selectedRecipientId === contact.id ? 'bg-purple-500/40' : 'bg-white/10'
                    } text-white`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-white text-sm font-medium">{contact.name}</div>
                      <div className="text-white/60 text-xs">
                        {contact.relationship_type || 'Contact'}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}

            {/* Add Contact Card */}
            {!loadingContacts && contacts.length < 10 && (
              <Link to="/relationships">
                <motion.div
                  className="flex-shrink-0 px-4 py-3 rounded-xl glass-card border border-dashed border-white/30 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">Add Contact</div>
                    <div className="text-white/60 text-xs">New person</div>
                  </div>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Empty State */}
          {contacts.length === 0 && !loadingContacts && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center glass-card p-4 rounded-xl"
            >
              <p className="text-sm text-white/70 mb-2">
                💡 Add contacts to enable relationship-aware communication
              </p>
              <Link to="/relationships" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Go to Relationships →
              </Link>
            </motion.div>
          )}
        </div>
      )}
      
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
        <div className="space-y-4">
          {/* Selected WIMTS Option */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/80 text-sm font-medium">✨ Your message:</div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 hover:bg-white/20 transition-all" 
                  onClick={() => { setSelected(null); setTranslations({}); setCurrentCardIndex(0); }}
                >
                  ← Change
                </button>
                {!intake_text && (
                  <button 
                    className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80 hover:bg-white/20 transition-all" 
                    onClick={() => { 
                      setSelected(null); 
                      setTranslations({}); 
                      setInputText(''); 
                      setOptions([]);
                      setCurrentCardIndex(0);
                    }}
                  >
                    🔄 Try Again
                  </button>
                )}
              </div>
            </div>
            <div className="text-white text-sm whitespace-pre-wrap">{selected.body}</div>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-3">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mode === '4' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'glass-card text-white/70'
              }`} 
              onClick={() => setMode('4')}
            >
              4 Listener Modes
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mode === '8' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'glass-card text-white/70'
              }`} 
              onClick={async () => { 
                setMode('8'); 
                if (selected) { 
                  setTLoading(true); 
                  try { 
                    const res = await generateTranslations(selected.body, '8', selectedRecipientId || undefined); 
                    setTranslations(res.translations); 
                    const keys = Object.keys(res.translations);
                    setTranslationKeys(keys);
                    setCurrentCardIndex(0); 
                  } finally { 
                    setTLoading(false); 
                  } 
                } 
              }}
            >
              8 Listener Modes
            </button>
          </div>

          {/* Translation Cards - Swipeable */}
          {tLoading && (
            <div className="text-center py-12 text-white/70">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white/70 mb-2"></div>
              <div>Generating translations…</div>
            </div>
          )}
          
          {!tLoading && translationKeys.length > 0 && (
            <div className="relative">
              {/* Card Counter */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                  <span className="text-white/60 text-sm">
                    {currentCardIndex + 1} / {translationKeys.length}
                  </span>
                  <span className="text-white font-medium text-sm">
                    {translationKeys[currentCardIndex]}
                  </span>
                </div>
              </div>

              {/* Swipeable Card Container */}
              <div className="relative h-[400px] flex items-center justify-center">
                {/* Navigation Buttons */}
                {currentCardIndex > 0 && (
                  <button
                    onClick={() => {
                      const newIndex = currentCardIndex - 1;
                      setCurrentCardIndex(newIndex);
                    }}
                    className="absolute left-0 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}

                {currentCardIndex < translationKeys.length - 1 && (
                  <button
                    onClick={() => {
                      const newIndex = currentCardIndex + 1;
                      setCurrentCardIndex(newIndex);
                    }}
                    className="absolute right-0 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}

                {/* Cards with Drag/Swipe */}
                <div className="relative w-full max-w-md">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.7}
                      onDragEnd={(e, { offset, velocity }) => {
                        // Responsive thresholds - easier on desktop
                        const offsetThreshold = window.innerWidth > 768 ? 80 : 50;
                        const velocityThreshold = window.innerWidth > 768 ? 300 : 500;
                        
                        const absOffset = Math.abs(offset.x);
                        const absVelocity = Math.abs(velocity.x);
                        
                        // Swipe left (next card) - check offset OR velocity
                        if ((offset.x < 0 && (absOffset > offsetThreshold || absVelocity > velocityThreshold)) && 
                            currentCardIndex < translationKeys.length - 1) {
                          setCurrentCardIndex(currentCardIndex + 1);
                        }
                        // Swipe right (previous card) - check offset OR velocity
                        else if ((offset.x > 0 && (absOffset > offsetThreshold || absVelocity > velocityThreshold)) && 
                                 currentCardIndex > 0) {
                          setCurrentCardIndex(currentCardIndex - 1);
                        }
                      }}
                      className="w-full cursor-grab active:cursor-grabbing"
                    >
                      <div className="glass-card p-6 rounded-2xl border-2 border-white/20 shadow-2xl">
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                              {translationKeys[currentCardIndex].charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-semibold">
                                {translationKeys[currentCardIndex]}
                              </div>
                              <div className="text-white/60 text-xs">
                                Listener Mode
                              </div>
                            </div>
                          </div>
                          {recipientName && (
                            <div className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                              for {recipientName}
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="text-white text-base leading-relaxed whitespace-pre-wrap min-h-[200px]">
                          {translations[translationKeys[currentCardIndex]]}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {translationKeys.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentCardIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentCardIndex
                        ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Save Button */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={async () => {
                    try {
                      const res = await createReflection({
                        base_intake_text: inputText,
                        wimts_option_id: selected.option_id,
                        translation_mode: mode,
                        chosen_translation_key: translationKeys[currentCardIndex],
                        translation_text: translations[translationKeys[currentCardIndex]]
                      });
                      setSavedId(res.reflection_id);
                    } catch {
                      open();
                    }
                  }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  💾 Save This Translation
                </button>
                {savedId && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Saved successfully!
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WIMTSPage;