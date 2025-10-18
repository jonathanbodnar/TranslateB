import React, { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SimpleWaves from './SimpleWaves';
import { useWindowSize } from '../hooks/useWindowSize';
import { startSession } from '../features/intake/api/intakeClient';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [inputText, setInputText] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();


  const handleTranslateStart = useCallback(async () => {
    if (!inputText.trim() || isStarting) return;
    setIsStarting(true);
    setError(null);
    try {
      const { session_id } = await startSession(inputText, 'quick');
      navigate(`/quiz?session_id=${encodeURIComponent(session_id)}&text=${encodeURIComponent(inputText)}`);
    } catch (e: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsStarting(false);
    }
  }, [inputText, isStarting, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && inputText.trim()) {
      e.preventDefault();
      handleTranslateStart();
    }
  };

  return (
    <motion.div 
      className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Subtle Gradient Waves */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        variants={itemVariants}
      >
        <SimpleWaves 
          width={width}
          height={height}
          className="absolute inset-0"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="container text-center z-10 mx-auto container px-4"
        variants={itemVariants}
      >
        <motion.h1 
          className="heading-primary mb-4"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
            Easier communication
          </span>
          <br />
          through deeper understanding.
        </motion.h1>

        <motion.p 
          className="text-secondary mb-8 text-center px-4"
          variants={itemVariants}
        >
          Discover what you really meant to say.
          <br />
          Enhance your relationships through deeper understanding.
        </motion.p>

        {/* Input-first flow: start session directly from landing */}
        <motion.div 
          className="px-4 mb-8"
          variants={itemVariants}
        >
          <div className="glass-card p-4 text-left">
            <label className="text-white text-sm font-medium mb-2 block">
              What are you trying to say?
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="I got in a fight with my partner..."
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none resize-none h-24"
              maxLength={500}
              autoFocus
              autoComplete="off"
              onKeyDown={onKeyDown}
            />
            <div className="flex justify-between items-center mt-3">
              <span aria-live="polite" className="text-white/60 text-xs">
                {inputText.length}/500
              </span>
              <button
                onClick={handleTranslateStart}
                disabled={!inputText.trim() || isStarting}
                aria-busy={isStarting}
                className="glass-button px-4 py-3 min-h-[44px] flex items-center gap-2 disabled:opacity-50"
              >
                {isStarting ? (
                  <div className="loading-spinner w-4 h-4" />
                ) : null}
                Continue to quick quiz
              </button>
            </div>
            {error ? (
              <p className="text-red-300 text-xs mt-3">
                {error}
              </p>
            ) : null}
            <p className="text-white/60 text-xs mt-3">
              We never share your text. You control what’s saved.
            </p>
          </div>
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default LandingPage;
