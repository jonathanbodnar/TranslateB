import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateTranslations } from '../features/translator/api/translatorClient';
import { createReflection } from '../features/reflections/api/reflectionsClient';
import { useAuthGate } from '../features/auth/context/AuthGateContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../config/analyticsEvents';
import { getContacts, Contact } from '../features/contacts/api/contactsClient';
import { useAuth } from '../hooks/useAuth';

function useQuery() { return new URLSearchParams(useLocation().search); }

const TranslatorPage: React.FC = () => {
  const q = useQuery();
  const mode = (q.get('mode') as '4'|'8') || '4';
  const base = q.get('base') || '';
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState<string>('');
  const { open } = useAuthGate();
  const { track } = useAnalytics();
  const { user } = useAuth();
  
  // NEW: Contact/Recipient state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [recipientName, setRecipientName] = useState<string | null>(null);

  // NEW: Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.id) return;
      
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
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await generateTranslations(base, mode, selectedRecipientId || undefined);
        setTranslations(res.translations);
        const first = Object.keys(res.translations)[0];
        setActive(first);
        
        // Store recipient name from response
        if (res.recipient) {
          setRecipientName(res.recipient.name);
        } else {
          setRecipientName(null);
        }
        
        // Track analytics
        if (selectedRecipientId) {
          track(ANALYTICS_EVENTS.CONTACT_TRANSLATION_GENERATED, {
            contact_id: selectedRecipientId,
            mode,
            message_length: base.length,
          });
        }
      } finally { setLoading(false); }
    })();
  }, [base, mode, selectedRecipientId, track]);

  return (
    <motion.div className="min-h-screen gradient-primary p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-white text-xl font-semibold pt-12 mb-4">Translator</h1>
      
      {/* NEW: Contact Selector */}
      {user && (
        <div className="glass-card p-4 mb-4">
          <label className="block text-sm text-white/70 mb-2">
            Translating for:
          </label>
          <select
            value={selectedRecipientId || ''}
            onChange={(e) => setSelectedRecipientId(e.target.value || null)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loadingContacts}
          >
            <option value="">General audience</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
                {contact.relationship_type && ` (${contact.relationship_type})`}
              </option>
            ))}
          </select>
          
          {contacts.length === 0 && !loadingContacts && (
            <p className="text-sm text-gray-400 mt-2">
              No contacts yet.{' '}
              <Link to="/relationships" className="text-purple-400 hover:underline">
                Add contacts
              </Link>{' '}
              to enable relationship-aware translations.
            </p>
          )}
        </div>
      )}
      
      {/* Visual Indicator for Recipient */}
      {recipientName && (
        <div className="glass-card p-3 mb-4 bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <p className="text-sm text-purple-300">
              Adapting to{' '}
              <span className="font-semibold">{recipientName}'s</span> communication
              style
            </p>
          </div>
        </div>
      )}
      
      <div className="glass-card p-4 mb-4">
        <div className="text-white/70 text-sm mb-2">Base:</div>
        <div className="text-white text-sm">{base}</div>
      </div>
      {loading && <div className="text-white/70">Generating…</div>}
      {!loading && (
        <div className="glass-card p-4">
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.keys(translations).map((k) => (
              <button key={k} onClick={() => { 
                setActive(k); 
                track(ANALYTICS_EVENTS.TRANSLATION_TAB_VIEWED, { tab: k });
              }} className={`px-3 py-1 rounded-full text-sm ${active === k ? 'bg-white/30 text-white' : 'bg-white/10 text-white/80'}`}>
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
                    base_intake_text: base,
                    wimts_option_id: 'selected',
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
        </div>
      )}
    </motion.div>
  );
};

export default TranslatorPage;

