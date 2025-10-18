import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { generateWIMTS, selectWIMTS } from '../features/wimts/api/wimtsClient';
import { generateTranslations } from '../features/translator/api/translatorClient';
import { createReflection } from '../features/reflections/api/reflectionsClient';
import { useAuthGate } from '../features/auth/context/AuthGateContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const WIMTSPage: React.FC = () => {
  const navigate = useNavigate();
  const q = useQuery();
  const session_id = q.get('session_id') || '';
  const intake_text = q.get('text') || '';
  const [options, setOptions] = useState<{ option_id: string; title: string; body: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ option_id: string; body: string } | null>(null);
  const [mode, setMode] = useState<'4' | '8'>('4');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>('');
  const [tLoading, setTLoading] = useState(false);
  const [savedId, setSavedId] = useState<string>('');
  const { open } = useAuthGate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await generateWIMTS(session_id, intake_text, {});
        setOptions(res.what_i_meant_variants);
      } finally {
        setLoading(false);
      }
    })();
  }, [session_id, intake_text]);

  const onSelect = async (opt: { option_id: string; body: string }) => {
    setSelected(opt);
    setSavedId('');
    await selectWIMTS(session_id, opt.option_id);
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
      <div className="glass-card p-4 mb-4">
        <p className="text-white/80 text-sm">Your input:</p>
        <p className="text-white text-sm mt-2">{intake_text}</p>
      </div>
      {loading && <div className="text-white/70">Generating options…</div>}

      {!selected && (
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
                        base_intake_text: intake_text,
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

