import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { QuizQuestion, QuizSessionAnswer, PersonalityBuckets, SwipeDirection } from '../types';

const PersonalityQuiz: React.FC = () => {
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizSessionAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<PersonalityBuckets | null>(null);

  // Mock quiz questions based on your sketches
  const questions: QuizQuestion[] = [
    {
      id: '1',
      text: 'When facing a difficult conversation, I tend to:',
      variants: ['How do you approach tough talks?'],
      type: 'swipe',
      answers: [
        {
          id: '1a',
          text: 'Think through what I want to say logically first',
          bucketWeights: { thinking: 7, sensing: 2, intuition: 1, feeling: 0 },
          direction: 'right'
        },
        {
          id: '1b',
          text: 'Focus on how the other person might feel',
          bucketWeights: { feeling: 8, intuition: 1, sensing: 1, thinking: 0 },
          direction: 'left'
        },
        {
          id: '1c',
          text: 'Take time to process before responding',
          bucketWeights: { sensing: 3, thinking: 3, feeling: 2, intuition: 2 },
          direction: 'up'
        },
        {
          id: '1d',
          text: 'I usually avoid difficult conversations',
          bucketWeights: { feeling: 4, sensing: 3, intuition: 2, thinking: 1 },
          direction: 'up'
        },
        {
          id: '1e',
          text: 'I prefer direct, honest communication',
          bucketWeights: { thinking: 5, sensing: 3, feeling: 2, intuition: 0 },
          direction: 'up'
        }
      ]
    },
    {
      id: '2',
      text: 'What motivates you most in relationships?',
      variants: ['What drives your connections?'],
      type: 'swipe',
      answers: [
        {
          id: '2a',
          text: 'Deep emotional understanding and connection',
          bucketWeights: { feeling: 6, intuition: 3, thinking: 1, sensing: 0 },
          direction: 'right'
        },
        {
          id: '2b',
          text: 'Clear communication and shared goals',
          bucketWeights: { thinking: 5, sensing: 4, feeling: 1, intuition: 0 },
          direction: 'left'
        },
        {
          id: '2c',
          text: 'Having fun and enjoying time together',
          bucketWeights: { feeling: 3, sensing: 3, intuition: 2, thinking: 2 },
          direction: 'up'
        },
        {
          id: '2d',
          text: 'Relationships are complicated for me',
          bucketWeights: { intuition: 4, feeling: 3, thinking: 2, sensing: 1 },
          direction: 'up'
        },
        {
          id: '2e',
          text: 'Mutual respect and trust above all',
          bucketWeights: { thinking: 4, feeling: 3, sensing: 2, intuition: 1 },
          direction: 'up'
        }
      ]
    },
    {
      id: '3',
      text: 'When someone is upset with you, you:',
      variants: ['How do you handle conflict?'],
      type: 'swipe',
      answers: [
        {
          id: '3a',
          text: 'Want to understand the details of what went wrong',
          bucketWeights: { sensing: 6, thinking: 3, feeling: 1, intuition: 0 },
          direction: 'right'
        },
        {
          id: '3b',
          text: 'Focus on the underlying patterns and future prevention',
          bucketWeights: { intuition: 7, thinking: 2, feeling: 1, sensing: 0 },
          direction: 'left'
        }
      ]
    },
    {
      id: '4',
      text: 'Your ideal way to express care is:',
      variants: ['How do you show you care?'],
      type: 'swipe',
      answers: [
        {
          id: '4a',
          text: 'Through thoughtful actions and practical support',
          bucketWeights: { sensing: 5, thinking: 3, feeling: 2, intuition: 0 },
          direction: 'right'
        },
        {
          id: '4b',
          text: 'Through deep conversations and emotional presence',
          bucketWeights: { feeling: 6, intuition: 3, thinking: 1, sensing: 0 },
          direction: 'left'
        }
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleSwipe = (info: PanInfo) => {
    const threshold = 80;
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;
    const offsetX = info.offset.x;
    
    // Determine swipe direction based on velocity and offset
    let selectedAnswer: any = null;

    // Check for strong horizontal swipes first
    if (Math.abs(velocityX) > threshold && Math.abs(velocityX) > Math.abs(velocityY)) {
      if (velocityX > 0) {
        selectedAnswer = currentQuestion.answers.find(a => a.direction === 'right');
      } else {
        selectedAnswer = currentQuestion.answers.find(a => a.direction === 'left');
      }
    }
    // Check for upward swipes
    else if (velocityY < -threshold) {
      // Get all up direction answers and cycle through them based on swipe angle
      const upAnswers = currentQuestion.answers.filter(a => a.direction === 'up');
      if (upAnswers.length > 0) {
        // Determine which neutral option based on horizontal offset
        let answerIndex = 0;
        if (offsetX < -50 && upAnswers.length > 1) {
          answerIndex = 1; // up-left neutral disagree
        } else if (offsetX > 50 && upAnswers.length > 2) {
          answerIndex = 2; // up-right neutral agree
        } else {
          answerIndex = 0; // straight up neutral
        }
        
        selectedAnswer = upAnswers[answerIndex] || upAnswers[0];
      }
    }

    if (selectedAnswer) {
      // Record the answer
      const newAnswer: QuizSessionAnswer = {
        questionId: currentQuestion.id,
        answerId: selectedAnswer.id,
        timestamp: new Date()
      };

      setAnswers(prev => [...prev, newAnswer]);

      // Move to next question or complete quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeQuiz([...answers, newAnswer]);
      }
    }
  };

  const completeQuiz = (allAnswers: QuizSessionAnswer[]) => {
    // Calculate personality buckets
    const buckets: PersonalityBuckets = {
      feeling: 0,
      sensing: 0,
      intuition: 0,
      thinking: 0
    };

    allAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      const selectedAnswer = question?.answers.find(a => a.id === answer.answerId);
      
      if (selectedAnswer) {
        buckets.feeling += selectedAnswer.bucketWeights.feeling;
        buckets.sensing += selectedAnswer.bucketWeights.sensing;
        buckets.intuition += selectedAnswer.bucketWeights.intuition;
        buckets.thinking += selectedAnswer.bucketWeights.thinking;
      }
    });

    // Normalize to percentages
    const total = Object.values(buckets).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      buckets.feeling = Math.round((buckets.feeling / total) * 100);
      buckets.sensing = Math.round((buckets.sensing / total) * 100);
      buckets.intuition = Math.round((buckets.intuition / total) * 100);
      buckets.thinking = Math.round((buckets.thinking / total) * 100);
    }

    setResults(buckets);
    setIsCompleted(true);
  };

  const getTopTwoBuckets = (buckets: PersonalityBuckets) => {
    const entries = Object.entries(buckets);
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 2);
  };

  if (isCompleted && results) {
    const topTwo = getTopTwoBuckets(results);
    
    return (
      <motion.div 
        className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="glass-card p-8 max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="heading-secondary mb-6">Your Personality Profile</h2>
          
          <div className="space-y-4 mb-6">
            {topTwo.map(([bucket, percentage], index) => (
              <div key={bucket} className="text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium capitalize">{bucket}</span>
                  <span className="text-white/80">{percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-secondary mb-8">
            You primarily process through <strong className="text-white">{topTwo[0][0]}</strong> and <strong className="text-white">{topTwo[1][0]}</strong>. 
            This means you tend to approach relationships with a blend of emotional awareness and practical thinking.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="glass-button py-3 font-medium"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate('/relationships')}
              className="glass-button py-3 font-medium flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
        <h1 className="text-white text-xl font-semibold">Personality Quiz</h1>
        <div className="w-10" />
      </motion.div>

      {/* Progress */}
      <motion.div 
        className="px-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between text-white/60 text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <motion.div 
            className="bg-white h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Question Card */}
      <motion.div 
        className="flex-1 px-4 flex items-center justify-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-full max-w-md">
          <motion.h2 
            className="text-white text-xl font-semibold text-center mb-8"
            key={currentQuestion.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentQuestion.text}
          </motion.h2>

          {/* Swipeable Answer Cards */}
          <div className="relative h-80 mb-8" ref={constraintsRef}>
            <motion.div
              className="swipe-card glass-card p-6 flex items-center justify-center"
              drag
              dragConstraints={constraintsRef}
              onDragEnd={(_, info) => handleSwipe(info)}
              whileDrag={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center">
                <p className="text-white text-lg font-medium mb-4">
                  {currentQuestion.text}
                </p>
                <div className="text-white/60 text-sm">
                  <p>← {currentQuestion.answers.find(a => a.direction === 'left')?.text.substring(0, 30)}...</p>
                  <p>→ {currentQuestion.answers.find(a => a.direction === 'right')?.text.substring(0, 30)}...</p>
                  <p>↑ Neutral options available</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Swipe Instructions */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white/60 text-sm mb-4">
              Swipe in any direction to choose
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              <div className="text-center">
                <div className="text-white/40 text-xs">↖</div>
                <div className="text-white/60 text-xs">Disagree</div>
              </div>
              <div className="text-center">
                <div className="text-white/40 text-xs">↑</div>
                <div className="text-white/60 text-xs">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-white/40 text-xs">↗</div>
                <div className="text-white/60 text-xs">Agree</div>
              </div>
              <div className="text-center">
                <div className="text-white/40 text-xs">←</div>
                <div className="text-white/60 text-xs">Option A</div>
              </div>
              <div></div>
              <div className="text-center">
                <div className="text-white/40 text-xs">→</div>
                <div className="text-white/60 text-xs">Option B</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalityQuiz;
