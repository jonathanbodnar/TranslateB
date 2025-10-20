import React from 'react';
import { motion } from 'framer-motion';
import { FearSnapshot } from '../types';

interface FearMapProps {
  data: FearSnapshot;
}

export const FearMap: React.FC<FearMapProps> = ({ data }) => {
  const { fears, heat_map } = data;

  // Sort fears by percentage for display
  const sortedFears = [...fears].sort((a, b) => b.pct - a.pct);

  // Get heat map intensity for color - using a gradient approach
  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return 'bg-white/5';
    if (intensity > 0.7) return 'bg-red-500/25 border-red-500/30';
    if (intensity > 0.5) return 'bg-orange-500/20 border-orange-500/25';
    if (intensity > 0.3) return 'bg-yellow-500/15 border-yellow-500/20';
    return 'bg-blue-500/10 border-blue-500/15';
  };

  return (
    <motion.div
      className="glass-card p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Fear Map</h2>

      {/* Top 3 Fears */}
      <div className="mb-6">
        <p className="text-white/60 text-sm mb-3">Primary Themes</p>
        <div className="space-y-3">
          {sortedFears.slice(0, 3).map((fear, index) => (
            <motion.div
              key={fear.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-white capitalize">{fear.key}</span>
                <span className="text-white/80 text-sm">{Math.round(fear.pct * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-2 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${
                      index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#10b981'
                    }, ${
                      index === 0 ? '#dc2626' : index === 1 ? '#d97706' : '#059669'
                    })`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${fear.pct * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Heat Map */}
      {heat_map && heat_map.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-sm">Intensity Pattern</p>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Low</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-white/5" />
                <div className="w-3 h-3 rounded-sm bg-blue-500/10" />
                <div className="w-3 h-3 rounded-sm bg-yellow-500/15" />
                <div className="w-3 h-3 rounded-sm bg-orange-500/20" />
                <div className="w-3 h-3 rounded-sm bg-red-500/25" />
              </div>
              <span>High</span>
            </div>
          </div>
          <div 
            className="grid gap-2 max-w-xs mx-auto" 
            style={{ gridTemplateColumns: `repeat(${heat_map[0].length}, 1fr)` }}
          >
            {heat_map.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square rounded-lg ${getHeatColor(cell)} backdrop-blur-sm`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + (rowIndex * row.length + colIndex) * 0.05 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  title={`Intensity: ${Math.round(cell * 100)}%`}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Insight Note */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60 text-sm">
          💡 <span className="text-white/80">Understanding your fear patterns</span> helps identify triggers and develop coping strategies.
        </p>
      </div>
    </motion.div>
  );
};

