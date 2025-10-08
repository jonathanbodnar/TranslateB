import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, RotateCcw, Download, Heart, Brain, Lightbulb } from 'lucide-react';
import { TranslationCandidate, TranslationLayer } from '../types';

const QuickTranslator: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<TranslationCandidate[]>([]);
  const [currentTranslationIndex, setCurrentTranslationIndex] = useState(0);
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationCandidate | null>(null);
  const constraintsRef = useRef(null);

  // Mock AI translation function
  const generateTranslations = async (text: string): Promise<TranslationCandidate[]> => {
    setIsTranslating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockTranslations: TranslationCandidate[] = [
      {
        id: '1',
        text: `I'm feeling overwhelmed and need some space to process what happened between us. Can we talk when I'm ready?`,
        layer: 'emotion',
        confidence: 0.9
      },
      {
        id: '2', 
        text: `I'm scared that if we keep fighting like this, we might lose what we have. I don't want that to happen.`,
        layer: 'fear',
        confidence: 0.85
      },
      {
        id: '3',
        text: `What I really want is to feel heard and understood by you. That connection means everything to me.`,
        layer: 'longing',
        confidence: 0.88
      }
    ];
    
    setIsTranslating(false);
    return mockTranslations;
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    const results = await generateTranslations(inputText);
    setTranslations(results);
    setCurrentTranslationIndex(0);
  };

  const handleSwipe = (info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    
    if (Math.abs(velocity) > threshold) {
      if (velocity > 0) {
        // Swipe right - next translation
        setCurrentTranslationIndex(prev => 
          prev < translations.length - 1 ? prev + 1 : 0
        );
      } else {
        // Swipe left - previous translation
        setCurrentTranslationIndex(prev => 
          prev > 0 ? prev - 1 : translations.length - 1
        );
      }
    }
  };

  const handleSelectTranslation = (translation: TranslationCandidate) => {
    setSelectedTranslation(translation);
  };

  const getLayerIcon = (layer: TranslationLayer) => {
    switch (layer) {
      case 'emotion': return <Heart className="w-4 h-4" />;
      case 'fear': return <Brain className="w-4 h-4" />;
      case 'longing': return <Lightbulb className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getLayerColor = (layer: TranslationLayer) => {
    switch (layer) {
      case 'emotion': return 'from-pink-400 to-red-400';
      case 'fear': return 'from-purple-400 to-indigo-400';
      case 'longing': return 'from-blue-400 to-cyan-400';
      default: return 'from-pink-400 to-red-400';
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

      {/* Translation Results */}
      <AnimatePresence mode="wait">
        {translations.length > 0 && (
          <motion.div 
            className="flex-1 px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="glass-card p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Translation Results</h3>
                <div className="progress-dots">
                  {translations.map((_, index) => (
                    <div
                      key={index}
                      className={`progress-dot ${index === currentTranslationIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>

              {/* Swipeable Translation Cards */}
              <div className="relative h-64 mb-6" ref={constraintsRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTranslationIndex}
                    className="swipe-card glass-card p-6 flex flex-col justify-center"
                    drag="x"
                    dragConstraints={constraintsRef}
                    onDragEnd={(_, info) => handleSwipe(info)}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${getLayerColor(translations[currentTranslationIndex].layer)}`}>
                        {getLayerIcon(translations[currentTranslationIndex].layer)}
                      </div>
                      <span className="text-white/80 text-sm capitalize">
                        {translations[currentTranslationIndex].layer} Layer
                      </span>
                    </div>
                    
                    <p className="text-white text-base leading-relaxed mb-4">
                      {translations[currentTranslationIndex].text}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">
                        Confidence: {Math.round(translations[currentTranslationIndex].confidence * 100)}%
                      </span>
                      <span className="text-white/60 text-xs">
                        Swipe to explore more
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSelectTranslation(translations[currentTranslationIndex])}
                  className="glass-button py-3 font-medium"
                >
                  Select This One
                </button>
                <button
                  onClick={() => setTranslations([])}
                  className="glass-button py-3 font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Translation */}
      <AnimatePresence>
        {selectedTranslation && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-card p-6 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-white font-semibold mb-4 text-center">
                Perfect! Here's your translation:
              </h3>
              
              <div className="glass-card p-4 mb-6">
                <p className="text-white text-center">
                  {selectedTranslation.text}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTranslation.text);
                    // Could show toast notification here
                  }}
                  className="glass-button py-3 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="glass-button py-3"
                >
                  Take Quiz
                </button>
              </div>
              
              <button
                onClick={() => setSelectedTranslation(null)}
                className="w-full mt-3 text-white/60 text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuickTranslator;
