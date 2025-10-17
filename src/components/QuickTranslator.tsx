import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { startSession } from '../features/intake/api/intakeClient';

const QuickTranslator: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const { session_id } = await startSession(inputText, 'quick');
      navigate(`/quiz?session_id=${encodeURIComponent(session_id)}&text=${encodeURIComponent(inputText)}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen gradient-primary flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 pt-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button 
          onClick={() => navigate('/')}
          className="glass-button p-2 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold">Quick Translator</h1>
        <div className="w-10" />
      </motion.div>

      {/* Input Section */}
      <motion.div 
        className="px-4 mb-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-card p-4">
          <label className="text-white text-sm font-medium mb-2 block">
            What do you want to say?
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="I got in a fight with my wife..."
            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none resize-none h-24"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-white/60 text-xs">
              {inputText.length}/500
            </span>
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="glass-button px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {isTranslating ? (
                <div className="loading-spinner w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Translate
            </button>
          </div>
        </div>
      </motion.div>

      {/* Post-submit: flow continues to /quiz */}
    </motion.div>
  );
};

export default QuickTranslator;
