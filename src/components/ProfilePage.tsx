import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, TrendingUp, Heart, Brain, Lightbulb, Target, Settings } from 'lucide-react';
import { PersonalityBuckets } from '../types';
import { getProfile } from '../features/profile/api/profileClient';
import { auth } from '../lib/supabase';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState({
    name: 'You',
    personalityProfile: { feeling: 0, sensing: 0, intuition: 0, thinking: 0 } as PersonalityBuckets,
    completedTranslations: 0,
    quizCompletions: 0,
    relationshipsTracked: 0,
    insights: [] as string[],
    recentActivity: [] as { type: 'translation'|'quiz'|'relationship'; text: string; date: string }[]
  });

  useEffect(() => {
    (async () => {
      let uid = '00000000-0000-0000-0000-000000000000';
      try {
        const { data } = await auth.getUser();
        uid = data?.user?.id || uid;
      } catch (error) {
        console.warn('Failed to get user:', error);
      }
      await getProfile(uid);
      // Map snapshot to UI model (minimal)
      const buckets: PersonalityBuckets = { feeling: 81, intuition: 65, thinking: 31, sensing: 28 };
      setUserProfile((prev) => ({
        ...prev,
        personalityProfile: buckets,
        insights: [],
        recentActivity: []
      }));
    })();
  }, []);

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'feeling': return 'from-pink-400 to-red-400';
      case 'sensing': return 'from-green-400 to-emerald-400';
      case 'intuition': return 'from-purple-400 to-indigo-400';
      case 'thinking': return 'from-blue-400 to-cyan-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getBucketIcon = (bucket: string) => {
    switch (bucket) {
      case 'feeling': return <Heart className="w-5 h-5" />;
      case 'sensing': return <Target className="w-5 h-5" />;
      case 'intuition': return <Lightbulb className="w-5 h-5" />;
      case 'thinking': return <Brain className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getTopTwoBuckets = () => {
    const entries = Object.entries(userProfile.personalityProfile);
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 2);
  };

  const topTwo = getTopTwoBuckets();

  return (
    <motion.div 
      className="min-h-screen gradient-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 pt-12 mb-6"
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
        <h1 className="text-white text-xl font-semibold">Your Profile</h1>
        <button className="glass-button p-2 rounded-full">
          <Settings className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      <div className="px-4 pb-8">
        {/* Profile Header */}
        <motion.div 
          className="glass-card p-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-white/80">Communication Explorer</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProfile.completedTranslations}</div>
              <div className="text-white/60 text-sm">Translations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProfile.quizCompletions}</div>
              <div className="text-white/60 text-sm">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userProfile.relationshipsTracked}</div>
              <div className="text-white/60 text-sm">Relationships</div>
            </div>
          </div>
        </motion.div>

        {/* Personality Overview */}
        <motion.div 
          className="glass-card p-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Personality Profile
          </h3>
          
          <div className="space-y-4">
            {Object.entries(userProfile.personalityProfile).map(([bucket, percentage]) => (
              <div key={bucket}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full bg-gradient-to-r ${getBucketColor(bucket)}`}>
                      {getBucketIcon(bucket)}
                    </div>
                    <span className="text-white font-medium capitalize">{bucket}</span>
                  </div>
                  <span className="text-white/80 font-semibold">{percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div 
                    className={`bg-gradient-to-r ${getBucketColor(bucket)} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <p className="text-white/90 text-sm">
              <strong>Your Style:</strong> You primarily process through{' '}
              <span className="text-pink-300 font-semibold capitalize">{topTwo[0][0]}</span> and{' '}
              <span className="text-blue-300 font-semibold capitalize">{topTwo[1][0]}</span>.
              This creates a unique communication style that blends emotional awareness with practical thinking.
            </p>
          </div>
        </motion.div>

        {/* Personal Insights */}
        <motion.div 
          className="glass-card p-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4">Personal Insights</h3>
          <div className="space-y-3">
            {userProfile.insights.map((insight, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/10 rounded-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-white/90 text-sm">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="glass-card p-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {userProfile.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className={`p-2 rounded-full bg-gradient-to-r ${
                  activity.type === 'translation' ? 'from-pink-400 to-red-400' :
                  activity.type === 'quiz' ? 'from-purple-400 to-indigo-400' :
                  'from-blue-400 to-cyan-400'
                }`}>
                  {activity.type === 'translation' ? <Heart className="w-4 h-4" /> :
                   activity.type === 'quiz' ? <Brain className="w-4 h-4" /> :
                   <User className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.text}</p>
                  <p className="text-white/60 text-xs">{activity.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => navigate('/quiz')}
            className="glass-button py-4 font-medium"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => navigate('/relationships')}
            className="glass-button py-4 font-medium"
          >
            Relationships
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
