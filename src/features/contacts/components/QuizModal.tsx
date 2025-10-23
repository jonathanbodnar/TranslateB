import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizCard } from './QuizCard';
import { getQuiz, submitQuiz, QuizCard as QuizCardType, QuizResponse, QuizAnalysis } from '../api/quizClient';

interface QuizModalProps {
  contactId: string;
  contactName: string;
  onClose: () => void;
  onComplete: (analysis: QuizAnalysis) => void;
}

type QuizState = 'loading' | 'quiz' | 'results' | 'error';

export const QuizModal: React.FC<QuizModalProps> = ({
  contactId,
  contactName,
  onClose,
  onComplete,
}) => {
  const [state, setState] = useState<QuizState>('loading');
  const [cards, setCards] = useState<QuizCardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [responses, setResponses] = useState<Map<number, QuizResponse>>(new Map());
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load quiz on mount
  useEffect(() => {
    loadQuiz();
  }, [contactId]);

  const loadQuiz = async () => {
    try {
      setState('loading');
      const data = await getQuiz(contactId);

      if (data.completed) {
        // User already completed quiz
        setError('You have already completed this quiz for this contact.');
        setState('error');
        return;
      }

      if (data.cards && data.cards.length > 0) {
        setCards(data.cards);
        setState('quiz');
      } else {
        setError('No quiz cards available.');
        setState('error');
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Failed to load quiz. Please try again.');
      setState('error');
    }
  };

  const handleAnswer = (answer: any) => {
    const currentCard = cards[currentCardIndex];
    const response: QuizResponse = {
      cardNumber: currentCard.cardNumber,
      cardType: currentCard.cardType,
      question: currentCard.question,
      inputType: currentCard.inputType,
      answer,
    };

    setResponses((prev) => new Map(prev.set(currentCard.cardNumber, response)));
  };

  const handleNext = async () => {
    const currentCard = cards[currentCardIndex];

    // Validate that user has answered
    if (!responses.has(currentCard.cardNumber)) {
      alert('Please answer the question before continuing.');
      return;
    }

    // Check if this is the last card
    if (currentCardIndex === cards.length - 1) {
      // Submit quiz
      await submitQuizResponses();
    } else {
      // Move to next card
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const submitQuizResponses = async () => {
    try {
      setIsSubmitting(true);
      const responsesArray = Array.from(responses.values());

      const result = await submitQuiz(contactId, responsesArray);

      // Check if there's a conditional card
      if (result.conditionalCard && cards.length === 5) {
        // Add conditional card and show it
        setCards([...cards, result.conditionalCard]);
        setCurrentCardIndex(5);
        setIsSubmitting(false);
      } else {
        // Quiz complete, show results
        setAnalysis(result.analysis);
        setState('results');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError('Failed to submit quiz. Please try again.');
      setState('error');
      setIsSubmitting(false);
    }
  };

  const handleApplySuggestions = () => {
    if (analysis) {
      onComplete(analysis);
      onClose();
    }
  };

  const handleSkipSuggestions = () => {
    onClose();
  };

  const currentCard = cards[currentCardIndex];
  const currentResponse = currentCard ? responses.get(currentCard.cardNumber) : null;

  return (
    <div className="fixed inset-0 z-50 gradient-primary overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative h-full flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Loading State */}
        {state === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white/60">Loading quiz...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="flex items-center justify-center h-full p-6">
            <div className="glass-card p-12 text-center max-w-md">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
              <p className="text-white/60 mb-6">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Quiz State - Full Screen Layout */}
        {state === 'quiz' && currentCard && (
          <div className="flex flex-col h-full p-6 max-w-4xl mx-auto">
            {/* Compact Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {contactName}
                  </h2>
                  <p className="text-white/50 text-sm">
                    Question {currentCardIndex + 1} of {cards.length}
                  </p>
                </div>
              </div>
              
              {/* Compact Progress bar */}
              <div className="flex items-center gap-2">
                {cards.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                      index < currentCardIndex
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : index === currentCardIndex
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quiz Card - Takes remaining space */}
            <div className="flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden pb-6">
              <AnimatePresence mode="wait">
                <QuizCard
                  key={currentCard.cardNumber}
                  cardNumber={currentCard.cardNumber}
                  cardType={currentCard.cardType}
                  question={currentCard.question}
                  inputType={currentCard.inputType}
                  options={currentCard.options}
                  placeholder={currentCard.placeholder}
                  sliderLabels={currentCard.sliderLabels}
                  onAnswer={handleAnswer}
                  initialValue={currentResponse?.answer}
                />
              </AnimatePresence>
            </div>

            {/* Fixed Navigation at Bottom */}
            <div className="flex justify-between items-center gap-4 pt-4">
              <motion.button
                onClick={handleBack}
                disabled={currentCardIndex === 0}
                whileHover={currentCardIndex > 0 ? { scale: 1.05, x: -4 } : {}}
                whileTap={currentCardIndex > 0 ? { scale: 0.95 } : {}}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentCardIndex === 0
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/10'
                }`}
              >
                ← Back
              </motion.button>
              
              <motion.button
                onClick={handleNext}
                disabled={!currentResponse || isSubmitting}
                whileHover={currentResponse && !isSubmitting ? { scale: 1.05 } : {}}
                whileTap={currentResponse && !isSubmitting ? { scale: 0.95 } : {}}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  !currentResponse || isSubmitting
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 border-2 border-purple-400/50'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : currentCardIndex === cards.length - 1 ? (
                  <span>Submit Quiz ✨</span>
                ) : (
                  <span>Continue →</span>
                )}
              </motion.button>
            </div>
          </div>
        )}

        {/* Results State - Full Screen */}
        {state === 'results' && analysis && (
          <div className="flex flex-col h-full p-6 max-w-4xl mx-auto overflow-y-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-white/60">
                We've analyzed your responses and generated personalized communication
                recommendations for {contactName}.
              </p>
            </div>

            <div className="space-y-6 flex-1">
              {/* Key Insights */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💡</span> Key Insights
                </h3>
                <ul className="space-y-3">
                  {analysis.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-400 mr-3 mt-1">•</span>
                      <span className="text-white/80">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Patterns */}
              {analysis.patterns.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🔍</span> Patterns
                  </h3>
                  <ul className="space-y-3">
                    {analysis.patterns.map((pattern, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-pink-400 mr-3 mt-1">•</span>
                        <span className="text-white/80">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span>💬</span> Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-3 mt-1">•</span>
                        <span className="text-white/80">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Fixed Actions at Bottom */}
            <div className="flex gap-4 pt-6 mt-6">
              <button
                onClick={handleApplySuggestions}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold"
              >
                Apply Slider Suggestions
              </button>
              <button
                onClick={handleSkipSuggestions}
                className="px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border-2 border-white/10"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

