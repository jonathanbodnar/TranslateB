import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { generateWIMTS, selectWIMTS } from '../features/wimts/api/wimtsClient';
import { track } from '../analytics/tracker';

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await generateWIMTS(session_id, intake_text, {});
        setOptions(res.what_i_meant_variants);
        res.what_i_meant_variants.forEach((v) => track('wimts_option_viewed', { session_id, option_id: v.option_id }));
      } finally {
        setLoading(false);
      }
    })();
  }, [session_id, intake_text]);

  const onSelect = async (opt: { option_id: string; body: string }) => {
    await selectWIMTS(session_id, opt.option_id);
    track('wimts_option_selected', { session_id, option_id: opt.option_id });
    navigate(`/translate?mode=4&base=${encodeURIComponent(opt.body)}`);
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
      <div className="space-y-3">
        {options.map((opt) => (
          <div key={opt.option_id} className="glass-card p-4 cursor-pointer" onClick={() => onSelect({ option_id: opt.option_id, body: opt.body })}>
            <div className="text-white/60 text-xs mb-1">{opt.title}</div>
            <div className="text-white text-sm">{opt.body}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WIMTSPage;

