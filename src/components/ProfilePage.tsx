import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { getProfile } from '../features/profile/api/profileClient';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../config/analyticsEvents';
import { ProfileSnapshot } from '../features/profile/types';
import { CognitiveMap } from '../features/profile/components/CognitiveMap';
import { FearMap } from '../features/profile/components/FearMap';
import { InsightsFeed } from '../features/profile/components/InsightsFeed';
import { apiFetch } from '../api/http';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { track } = useAnalytics();
  
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);
  
  // Stats state
  const [stats, setStats] = useState({
    reflection_count: 0,
    quiz_count: 0,
    contact_count: 0,
    wimts_count: 0,
    insight_count: 0,
    member_since: null as string | null
  });
  
  // Weekly insights state
  const [weeklyInsights, setWeeklyInsights] = useState<{
    summary: string;
    top_themes: string[];
    mirror_moments: number;
    insights: Array<{
      title: string;
      content: string;
      category: string;
    }>;
  } | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      setError(null);
      
      // Load profile data and stats in parallel
      const [profileData, statsData] = await Promise.all([
        getProfile(user.id),
        apiFetch<typeof stats>(`/api/profile/${user.id}/stats`)
      ]);
      
      setProfile(profileData);
      setStats(statsData);
      
      // Update tb_profile with latest cognitive data from API
      const localProfile = {
        lead: profileData.cognitive_snapshot.dominant_streams[0] || 'Feeling',
        next: profileData.cognitive_snapshot.dominant_streams[1] || 'Intuition',
        mode: 'Inward-led',
        processing_tendencies: profileData.cognitive_snapshot.processing_tendencies,
        blind_spots: profileData.cognitive_snapshot.blind_spots,
        trigger_probability_index: profileData.cognitive_snapshot.trigger_probability_index,
        communication_lens: profileData.cognitive_snapshot.communication_lens
      };
      
      localStorage.setItem('tb_profile', JSON.stringify({
        profile: localProfile,
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadWeeklyInsights = async () => {
    if (!user?.id) return;
    
    setInsightsLoading(true);
    try {
      const insights = await apiFetch<typeof weeklyInsights>('/api/insights/weekly');
      setWeeklyInsights(insights);
    } catch (error) {
      console.error('Failed to load weekly insights:', error);
      // Don't set error state - insights are optional
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadWeeklyInsights()]);
  };

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;
    
    // Redirect unauthorized users to home
    if (!user) {
      navigate('/', { replace: true });
      return;
    }
    
    // Only load once
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    // Track analytics
    track(ANALYTICS_EVENTS.PROFILE_VIEWED);
    
    // Load profile and weekly insights for authenticated user
    loadProfile();
    loadWeeklyInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-white/80">Generating your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => loadProfile()}
            className="glass-button px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No profile state (shouldn't happen if loading worked)
  if (!profile) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-white/80 mb-4">No profile data available yet.</p>
          <p className="text-white/60 text-sm mb-4">Complete the personality quiz to generate your profile.</p>
          <button
            onClick={() => navigate('/')}
            className="glass-button px-6 py-2"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-white text-xl font-semibold">My Inner Mirror</h1>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="glass-button p-2 rounded-full"
        >
          <RefreshCw className={`w-6 h-6 text-white ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>

      <div className="px-4 pb-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {stats.reflection_count}
            </div>
            <div className="text-xs text-white/60 mt-1">Reflections</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {stats.quiz_count}
            </div>
            <div className="text-xs text-white/60 mt-1">Quizzes</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {stats.contact_count}
            </div>
            <div className="text-xs text-white/60 mt-1">Contacts</div>
          </div>
        </motion.div>
        
        {/* Weekly Insights */}
        {insightsLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 mb-6 text-center"
          >
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white/70 mb-2"></div>
            <p className="text-white/70 text-sm">Generating this week's insights...</p>
          </motion.div>
        )}
        
        {!insightsLoading && weeklyInsights && weeklyInsights.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>📊</span>
              This Week's Insights
            </h2>
            
            <p className="text-white/80 mb-4 leading-relaxed">
              {weeklyInsights.summary}
            </p>
            
            {weeklyInsights.top_themes && weeklyInsights.top_themes.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-white/60 mb-2">Top Themes:</div>
                <div className="flex flex-wrap gap-2">
                  {weeklyInsights.top_themes.map((theme, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {weeklyInsights.mirror_moments > 0 && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-2xl">✨</span>
                <span>
                  {weeklyInsights.mirror_moments} mirror moment{weeklyInsights.mirror_moments !== 1 ? 's' : ''} this week
                </span>
              </div>
            )}
            
            {weeklyInsights.insights && weeklyInsights.insights.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="text-sm text-white/60 mb-2">Key Insights:</div>
                {weeklyInsights.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {insight.category === 'breakthrough' ? '🌟' : 
                         insight.category === 'strength' ? '💪' :
                         insight.category === 'blind_spot' ? '👁️' : '🔄'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm mb-1">
                          {insight.title}
                        </div>
                        <div className="text-white/70 text-xs">
                          {insight.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {/* AI-Generated Components */}
        <CognitiveMap data={profile.cognitive_snapshot} />
        <FearMap data={profile.fear_snapshot} />
        <InsightsFeed data={profile.insights_snapshot} userId={user!.id} />
        
        {/* Metadata */}
        <div className="text-center text-white/40 text-xs mt-6">
          Generated {new Date(profile.metadata.generated_at).toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
