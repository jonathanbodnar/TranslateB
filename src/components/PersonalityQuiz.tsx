import React, { useEffect, useRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { QuizQuestion, QuizSessionAnswer, SwipeDirection } from '../types';
import { answer, complete, getQuestions } from '../features/intake/api/intakeClient';

const PersonalityQuiz: React.FC = () => {
  const navigate = useNavigate();
  const constraintsRef = useRef(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizSessionAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
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

  const handleSwipe = (info: PanInfo) => {
    if (!currentQuestion) return;
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

      const choice = selectedAnswer.direction === 'left' ? 'left' : selectedAnswer.direction === 'right' ? 'right' : 'neither';
      setAnswers(prev => [...prev, newAnswer]);
      // send to API
      answer(session_id, currentQuestion.id, choice as any, selectedAnswer.direction === 'up' ? 1 : 2).catch(() => {});

      // Move to next question or complete quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeQuiz([...answers, newAnswer]);
      }
    }
  };

  const completeQuiz = async (_allAnswers: QuizSessionAnswer[]) => {
    // Call backend to complete and get AI-generated profile
    try {
      const res = await complete(session_id);
      if (res && (res as any).profile) {
        const profileData = (res as any).profile;
        setProfile(profileData);
        
        // Store profile in localStorage for anonymous users
        // This allows us to restore it when they sign up
        try {
          const profileStorage = {
            session_id,
            profile: profileData,
            intake_text,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(`tb_profile_${session_id}`, JSON.stringify(profileStorage));
          console.log('Profile stored for session:', session_id);
        } catch (storageError) {
          console.error('Failed to store profile:', storageError);
          // Continue even if storage fails - not critical
        }
      }
    } catch {}
    setIsCompleted(true);
  };

  // Removed local bucket rendering; profile now comes from backend

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

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate(`/wimts?session_id=${encodeURIComponent(session_id)}&text=${encodeURIComponent(intake_text)}`)}
              className="glass-button py-3 font-medium"
            >
              Continue
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

          {/* Swipeable Answer Cards */}
          <div className="relative h-80 mb-8" ref={constraintsRef}>
            {currentQuestion ? (
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
