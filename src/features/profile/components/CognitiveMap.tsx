import React from 'react';
import { motion } from 'framer-motion';
import { CognitiveSnapshot } from '../types';

interface CognitiveMapProps {
  data: CognitiveSnapshot;
}

export const CognitiveMap: React.FC<CognitiveMapProps> = ({ data }) => {
  const {
    dominant_streams,
    shadow_streams,
    processing_tendencies,
    blind_spots,
    trigger_probability_index,
    communication_lens
  } = data;

  return (
    <motion.div
      className="glass-card p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Cognitive Map</h2>

      {/* Dominant & Shadow Streams */}
      <div className="mb-6">
        <div className="mb-3">
          <p className="text-white/60 text-sm mb-2">Dominant Styles</p>
          <div className="flex gap-2 flex-wrap">
            {dominant_streams.map((stream, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-white font-medium"
              >
                {stream}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white/60 text-sm mb-2">Shadow Styles</p>
          <div className="flex gap-2 flex-wrap">
            {shadow_streams.map((stream, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm"
              >
                {stream}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Tendencies */}
      <div className="mb-6">
        <p className="text-white/60 text-sm mb-2">Processing Tendencies</p>
        <div className="flex gap-2 flex-wrap">
          {processing_tendencies.map((tendency, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-sm"
            >
              #{tendency.toLowerCase().replace(/\s+/g, '-')}
            </span>
          ))}
        </div>
      </div>

      {/* Blind Spots */}
      {blind_spots && blind_spots.length > 0 && (
        <div className="mb-6">
          <p className="text-white/60 text-sm mb-2">Awareness Gaps</p>
          <div className="flex gap-2 flex-wrap">
            {blind_spots.map((spot, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 text-sm"
              >
                {spot}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trigger Probability Index */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white/60 text-sm">Trigger Sensitivity</p>
          <span className="text-white font-medium">{Math.round(trigger_probability_index * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${trigger_probability_index * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Communication Lens */}
      <div>
        <p className="text-white/60 text-sm mb-3">Communication Lens</p>
        
        {/* Incoming */}
        <div className="mb-3">
          <p className="text-white/80 text-xs mb-1">How you receive ←</p>
          <div className="flex gap-1">
            {Object.entries(communication_lens.incoming).map(([key, value]) => (
              <div key={key} className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/60 text-xs">{key}</span>
                  <span className="text-white/80 text-xs">{Math.round(value * 100)}</span>
                </div>
                <div className="w-full bg-white/10 rounded h-1.5">
                  <div
                    className="h-1.5 rounded bg-gradient-to-r from-cyan-400 to-blue-400"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outgoing */}
        <div>
          <p className="text-white/80 text-xs mb-1">How you express →</p>
          <div className="flex gap-1">
            {Object.entries(communication_lens.outgoing).map(([key, value]) => (
              <div key={key} className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/60 text-xs">{key}</span>
                  <span className="text-white/80 text-xs">{Math.round(value * 100)}</span>
                </div>
                <div className="w-full bg-white/10 rounded h-1.5">
                  <div
                    className="h-1.5 rounded bg-gradient-to-r from-purple-400 to-pink-400"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

