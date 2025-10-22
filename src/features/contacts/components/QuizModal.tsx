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
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="glass-card p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading quiz...</p>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="glass-card p-12 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Quiz State */}
        {state === 'quiz' && currentCard && (
          <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Relationship Quiz: {contactName}
              </h2>
              <p className="text-gray-400 mb-4">
                Help us understand your communication dynamics
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Question {currentCardIndex + 1} of {cards.length}
              </p>
            </div>

            {/* Quiz Card */}
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

            {/* Navigation */}
            <div className="flex justify-between items-center glass-card p-6">
              <button
                onClick={handleBack}
                disabled={currentCardIndex === 0}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  currentCardIndex === 0
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!currentResponse || isSubmitting}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  !currentResponse || isSubmitting
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isSubmitting
                  ? 'Analyzing...'
                  : currentCardIndex === cards.length - 1
                  ? 'Submit'
                  : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* Results State */}
        {state === 'results' && analysis && (
          <div className="glass-card p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-gray-400">
                We've analyzed your responses and generated personalized communication
                recommendations for {contactName}.
              </p>
            </div>

            {/* Key Insights */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">💡 Key Insights</h3>
              <ul className="space-y-2">
                {analysis.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-gray-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Patterns */}
            {analysis.patterns.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">🔍 Patterns</h3>
                <ul className="space-y-2">
                  {analysis.patterns.map((pattern, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-pink-400 mr-2">•</span>
                      <span className="text-gray-300">{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">💬 Suggestions</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span className="text-gray-300">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-700">
              <button
                onClick={handleApplySuggestions}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Apply Slider Suggestions
              </button>
              <button
                onClick={handleSkipSuggestions}
                className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
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

