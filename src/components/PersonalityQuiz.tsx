import React, { useEffect, useRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { QuizQuestion, QuizSessionAnswer, SwipeDirection } from '../types';
import { answer, complete, getQuestions } from '../features/intake/api/intakeClient';

const PersonalityQuiz: React.FC = () => {
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizSessionAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [profile, setProfile] = useState<{ lead: string; next: string; mode: string; frictions_top: string[]; fears: Record<string, number> } | null>(null);
  const q = new URLSearchParams(useLocation().search);
  const session_id = q.get('session_id') || '';
  const intake_text = q.get('text') || '';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!session_id) {
          setLoadError('Missing session. Please start again.');
          return;
        }
        const res = await getQuestions(session_id);
        const adapted: QuizQuestion[] = (res?.questions || []).map((q: any) => ({
          id: q.id,
          text: q.headline,
          variants: [],
          type: 'swipe',
          answers: [
            { id: `${q.id}_L`, text: q.left?.label ?? 'Option A', direction: 'left' as SwipeDirection },
            { id: `${q.id}_R`, text: q.right?.label ?? 'Option B', direction: 'right' as SwipeDirection },
            { id: `${q.id}_U`, text: 'Neutral', direction: 'up' as SwipeDirection }
          ]
        }));
        setQuestions(adapted);
      } catch {
        setLoadError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [session_id]);

  const currentQuestion = questions[currentQuestionIndex];

  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);

  const handleSwipe = (info: PanInfo) => {
    if (!currentQuestion) return;
    
    // Responsive thresholds - easier on desktop
    const velocityThreshold = 50;
    const offsetThresholdX = window.innerWidth > 768 ? 150 : 100; // Shorter distance on desktop
    const offsetThresholdY = window.innerWidth > 768 ? 120 : 100;
    
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    
    // Determine swipe direction based on velocity and offset
    let selectedAnswer: any = null;

    // Check for strong horizontal swipes first (easier threshold)
    if (Math.abs(offsetX) > offsetThresholdX || Math.abs(velocityX) > velocityThreshold) {
      if (offsetX > 0 || velocityX > 0) {
        selectedAnswer = currentQuestion.answers.find(a => a.direction === 'right');
        setExitX(1000); // Exit to right
        setExitY(0);
      } else {
        selectedAnswer = currentQuestion.answers.find(a => a.direction === 'left');
        setExitX(-1000); // Exit to left
        setExitY(0);
      }
    }
    // Check for upward swipes (easier threshold)
    else if (offsetY < -offsetThresholdY || velocityY < -velocityThreshold) {
      // Get all up direction answers and cycle through them based on swipe angle
      const upAnswers = currentQuestion.answers.filter(a => a.direction === 'up');
      if (upAnswers.length > 0) {
        // Determine which neutral option based on horizontal offset
        let answerIndex = 0;
        if (offsetX < -50 && upAnswers.length > 1) {
          answerIndex = 1; // up-left neutral disagree
          setExitX(-500);
          setExitY(-1000);
        } else if (offsetX > 50 && upAnswers.length > 2) {
          answerIndex = 2; // up-right neutral agree
          setExitX(500);
          setExitY(-1000);
        } else {
          answerIndex = 0; // straight up neutral
          setExitX(0);
          setExitY(-1000);
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

      const choice = selectedAnswer.direction === 'left' ? 'left' : selectedAnswer.direction === 'right' ? 'right' : 'neither';
      setAnswers(prev => [...prev, newAnswer]);
      // send to API
      answer(session_id, currentQuestion.id, choice as any, selectedAnswer.direction === 'up' ? 1 : 2).catch(() => {});

      // Move to next question or complete quiz
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setExitX(0);
          setExitY(0);
        } else {
          completeQuiz([...answers, newAnswer]);
        }
      }, 300); // Delay to show swipe animation
    }
  };

  const completeQuiz = async (_allAnswers: QuizSessionAnswer[]) => {
    setIsGeneratingProfile(true);
    
    // Call backend to complete and get AI-generated profile
    try {
      const res = await complete(session_id);
      if (res && (res as any).profile) {
        const profileData = (res as any).profile;
        setProfile(profileData);
        
        // Store profile in localStorage using unified key
        try {
          const profileStorage = {
            session_id,
            profile: profileData,
            intake_text,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('tb_profile', JSON.stringify(profileStorage));
          console.log('Profile stored in tb_profile');
        } catch (storageError) {
          console.error('Failed to store profile:', storageError);
          // Continue even if storage fails - not critical
        }
      }
    } catch (error) {
      console.error('Failed to generate profile:', error);
    } finally {
      setIsGeneratingProfile(false);
      setIsCompleted(true);
    }
  };

  // Removed local bucket rendering; profile now comes from backend

  // Show loading state while generating profile
  if (isGeneratingProfile) {
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
          <div className="loading-spinner w-12 h-12 mx-auto mb-4" />
          <h2 className="heading-secondary mb-3">Analyzing your responses...</h2>
          <p className="text-white/60 text-sm">
            Our AI is generating your personalized communication profile.
            This will just take a moment.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (isCompleted && profile) {
    const lead = profile.lead;
    const next = profile.next;
    const FEAR_KEYS = ['powerlessness','incompetence','betrayal'] as const;
    const fearEntries = FEAR_KEYS.map((k) => {
      const v = Number((profile.fears || ({} as any))[k] ?? 0);
      const clamped = isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
      const pct = Math.round(clamped * 100);
      const label = k.charAt(0).toUpperCase() + k.slice(1);
      return { key: k, label, pct };
    });
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
            <div className="text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Lead</span>
                <span className="text-white/80">{lead}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">Next</span>
                <span className="text-white/80">{next}</span>
              </div>
              {profile.frictions_top?.length ? (
                <div className="mt-3">
                  <div className="text-white font-medium mb-1">Top Frictions</div>
                  <div className="text-white/70 text-sm">
                    {profile.frictions_top.join(' · ')}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Fears (bars) */}
          <div className="mb-8 text-left">
            <div className="text-white font-medium mb-3">Fears emphasis</div>
            <div className="space-y-3">
              {fearEntries.map(({ key, label, pct }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/80 text-sm">{label}</span>
                    <span className="text-white/60 text-xs">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-secondary mb-8 text-center">
            {profile && (profile as any).summary_md ? (
              <div className="prose prose-invert max-w-none text-white/90" dangerouslySetInnerHTML={{ __html: ((profile as any).summary_md as string).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            ) : (
              <>
                <p className="mb-2">You primarily process through <strong className="text-white">{lead}</strong> and <strong className="text-white">{next}</strong>.</p>
                <p className="mb-2">This means you tend to approach relationships with a blend of emotional awareness and practical thinking.</p>
              </>
            )}
          </div>

          <div className="gap-4">
            <button
              onClick={() => navigate(`/wimts?session_id=${encodeURIComponent(session_id)}&text=${encodeURIComponent(intake_text)}`)}
              className="w-full glass-button py-3 font-medium"
            >
              Continue
            </button>
            {/* <button
              onClick={() => navigate('/relationships')}
              className="glass-button py-3 font-medium flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button> */}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="glass-card p-6 w-full max-w-md text-center">
          <div className="loading-spinner w-6 h-6 mx-auto mb-3" />
          <p className="text-white/80">Loading quick quiz…</p>
        </div>
      </motion.div>
    );
  }

  if (loadError) {
    return (
      <motion.div 
        className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="glass-card p-6 w-full max-w-md text-center">
          <p className="text-red-300 mb-4">{loadError}</p>
          <button onClick={() => navigate('/')} className="glass-button px-4 py-2">Go back</button>
        </div>
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
          <span>Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}</span>
          <span>{questions.length ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0}%</span>
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
          {currentQuestion ? (
            <motion.h2 
              className="text-white text-xl font-semibold text-center mb-8"
              key={currentQuestion.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentQuestion.text}
            </motion.h2>
          ) : (
            <div className="h-8 mb-8" />
          )}

          {/* Swipeable Answer Cards - Dating App Style Stack */}
          <div className="relative h-80 mb-8">
            {/* Show next 2 cards in background */}
            {questions.slice(currentQuestionIndex + 1, currentQuestionIndex + 3).map((q, idx) => (
              <motion.div
                key={q.id}
                className="absolute inset-0 swipe-card glass-card p-6 flex items-center justify-center"
                initial={{ scale: 1 - (idx + 1) * 0.05, y: (idx + 1) * 10, opacity: 0.5 }}
                animate={{ scale: 1 - (idx + 1) * 0.05, y: (idx + 1) * 10, opacity: 0.5 }}
                style={{ 
                  zIndex: 10 - (idx + 1),
                  filter: `brightness(${1 - (idx + 1) * 0.2})`
                }}
              >
                <div className="text-center">
                  <p className="text-white text-lg font-medium mb-4">
                    {q.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Current card on top */}
            {currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                className="absolute inset-0 swipe-card glass-card p-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => handleSwipe(info)}
                initial={{ scale: 1, rotate: 0 }}
                animate={exitX !== 0 || exitY !== 0 ? { 
                  x: exitX, 
                  y: exitY, 
                  opacity: 0,
                  rotate: exitX > 0 ? 20 : exitX < 0 ? -20 : 0,
                  transition: { duration: 0.3 }
                } : { 
                  x: 0, 
                  y: 0, 
                  scale: 1, 
                  rotate: 0,
                  opacity: 1 
                }}
                whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                style={{ zIndex: 20 }}
              >
                <div className="text-center">
                  <p className="text-white text-lg font-medium mb-4">
                    {currentQuestion.text}
                  </p>
                  <div className="text-white/60 text-sm space-y-1">
                    <p>← {currentQuestion.answers.find(a => a.direction === 'left')?.text.substring(0, 30)}...</p>
                    <p>→ {currentQuestion.answers.find(a => a.direction === 'right')?.text.substring(0, 30)}...</p>
                    <p>↑ Neutral options available</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
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
