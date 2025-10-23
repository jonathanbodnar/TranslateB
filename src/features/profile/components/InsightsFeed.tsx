import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { InsightsSnapshot } from '../types';
import { likeInsight } from '../api/profileClient';

interface InsightsFeedProps {
  data: InsightsSnapshot;
  userId: string;
}

export const InsightsFeed: React.FC<InsightsFeedProps> = ({ data }) => {
  const { feed, mirror_moments, inner_dialogue_replay } = data;
  const [insights, setInsights] = useState(feed);
  const [likingId, setLikingId] = useState<string | null>(null);

  const handleLike = async (insightId: string) => {
    if (likingId) return; // Prevent double-clicks

    setLikingId(insightId);
    try {
      const result = await likeInsight(insightId);
      
      // Update local state
      setInsights(prev =>
        prev.map(insight =>
          insight.insight_id === insightId
            ? { ...insight, liked: result.liked }
            : insight
        )
      );
    } catch (error) {
      console.error('Failed to like insight:', error);
    } finally {
      setLikingId(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'pattern': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'breakthrough': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'mirror': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Insights Feed</h2>
        {mirror_moments > 0 && (
          <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm">🪞 {mirror_moments} Mirror Moments</span>
          </div>
        )}
      </div>

      {/* Insights List */}
      {insights.length > 0 ? (
        <div className="space-y-4 mb-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.insight_id}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{insight.icon}</span>
                  <h3 className="text-white font-medium">{insight.title}</h3>
                </div>
                <button
                  onClick={() => handleLike(insight.insight_id)}
                  disabled={likingId === insight.insight_id}
                  className={`transition-all ${
                    insight.liked
                      ? 'text-red-400 scale-110'
                      : 'text-white/40 hover:text-red-400 hover:scale-110'
                  } ${likingId === insight.insight_id ? 'opacity-50' : ''}`}
                >
                  <Heart className="w-5 h-5" fill={insight.liked ? 'currentColor' : 'none'} />
                </button>
              </div>

              <p className="text-white/70 text-sm mb-3">{insight.snippet}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {insight.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-2 py-0.5 rounded text-xs border ${getTypeColor(insight.type)}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {/* <span className="text-white/40 text-xs">
                  {new Date(insight.ts).toLocaleDateString()}
                </span> */}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/60 text-sm mb-2">No insights yet</p>
          <p className="text-white/40 text-xs">
            Insights will appear as you use WIMTS and complete reflections
          </p>
        </div>
      )}

      {/* Inner Dialogue Replay */}
      {inner_dialogue_replay && inner_dialogue_replay.length > 0 && (
        <div>
          <p className="text-white/60 text-sm mb-3">Inner Dialogue Reframes</p>
          <div className="space-y-3">
            {inner_dialogue_replay.map((dialogue, index) => (
              <motion.div
                key={index}
                className="p-4 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-lg border border-orange-500/20"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className="mb-2">
                  <span className="text-orange-300 text-xs font-medium">Old Script:</span>
                  <p className="text-white/70 text-sm italic">"{dialogue.script}"</p>
                </div>
                <div>
                  <span className="text-green-300 text-xs font-medium">Reframe:</span>
                  <p className="text-white/90 text-sm font-medium">"{dialogue.reframe}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

