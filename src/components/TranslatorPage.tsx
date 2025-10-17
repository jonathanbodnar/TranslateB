import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateTranslations } from '../features/translator/api/translatorClient';
import { createReflection } from '../features/reflections/api/reflectionsClient';
import { track } from '../analytics/tracker';
import RegistrationGate from '../features/auth/components/RegistrationGate';

function useQuery() { return new URLSearchParams(useLocation().search); }

const TranslatorPage: React.FC = () => {
  const q = useQuery();
  const mode = (q.get('mode') as '4'|'8') || '4';
  const base = q.get('base') || '';
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState<string>('');
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await generateTranslations(base, mode);
        setTranslations(res.translations);
        const first = Object.keys(res.translations)[0];
        setActive(first);
        track('translation_tab_viewed', { session_id: undefined, tab: first });
      } finally { setLoading(false); }
    })();
  }, [base, mode]);

  return (
    <motion.div className="min-h-screen gradient-primary p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-white text-xl font-semibold pt-12 mb-4">Translator</h1>
      <div className="glass-card p-4 mb-4">
        <div className="text-white/70 text-sm mb-2">Base:</div>
        <div className="text-white text-sm">{base}</div>
      </div>
      {loading && <div className="text-white/70">Generating…</div>}
      {!loading && (
        <div className="glass-card p-4">
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.keys(translations).map((k) => (
              <button key={k} onClick={() => { setActive(k); track('translation_tab_viewed', { tab: k }); }} className={`px-3 py-1 rounded-full text-sm ${active === k ? 'bg-white/30 text-white' : 'bg-white/10 text-white/80'}`}>
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
                  track('reflection.saved', { reflection_id: res.reflection_id, translation_mode: mode });
                } catch (e) {
                  setShowGate(true);
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
      <RegistrationGate isOpen={showGate} onClose={() => setShowGate(false)} />
    </motion.div>
  );
};

export default TranslatorPage;

