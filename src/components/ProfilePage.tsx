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

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { track } = useAnalytics();
  
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    try {
      setError(null);
      const data = await getProfile(user.id);
      setProfile(data);
      
      // Update tb_profile with latest cognitive data from API
      const profileData = {
        lead: data.cognitive_snapshot.dominant_streams[0] || 'Feeling',
        next: data.cognitive_snapshot.dominant_streams[1] || 'Intuition',
        mode: 'Inward-led',
        processing_tendencies: data.cognitive_snapshot.processing_tendencies,
        blind_spots: data.cognitive_snapshot.blind_spots,
        trigger_probability_index: data.cognitive_snapshot.trigger_probability_index,
        communication_lens: data.cognitive_snapshot.communication_lens
      };
      
      localStorage.setItem('tb_profile', JSON.stringify({
        profile: profileData,
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
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
    
    // Load profile for authenticated user
    loadProfile();
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
