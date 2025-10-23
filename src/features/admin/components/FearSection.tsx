import React from 'react';
import { FearConfig } from '../types';

interface FearSectionProps {
  config: FearConfig;
  onChange: (config: FearConfig) => void;
}

export function FearSection({ config, onChange }: FearSectionProps) {
  const handleWeightChange = (
    fear: keyof FearConfig['weights'],
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...config,
        weights: {
          ...config.weights,
          [fear]: numValue,
        },
      });
    }
  };

  const handleHalfLifeChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onChange({
        ...config,
        recency_decay: {
          half_life_days: numValue,
        },
      });
    }
  };

  const handleGradientChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newGradient = [...config.heat_map_gradient];
      newGradient[index] = numValue;
      onChange({
        ...config,
        heat_map_gradient: newGradient,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">Fear Configuration</h2>
        <p className="text-white/60 text-sm mb-6">
          Configure weights and decay rates for fear pattern analysis
        </p>
      </div>

      {/* Fear Weights */}
      <div>
        <h3 className="text-white font-medium mb-3">Fear Weights</h3>
        <p className="text-white/60 text-sm mb-3">
          Sensitivity to each fear category (0-2)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['unworthiness', 'unlovability', 'powerlessness', 'unsafety'] as const).map(
            (fear) => (
              <div key={fear}>
                <label className="block text-white/80 text-sm mb-2 capitalize">
                  {fear}
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.weights[fear]}
                  onChange={(e) => handleWeightChange(fear, e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Recency Decay */}
      <div>
        <label className="block text-white/80 text-sm mb-2">
          Recency Decay (Half-Life Days)
        </label>
        <p className="text-white/60 text-xs mb-2">
          How many days for fear intensity to halve
        </p>
        <input
          type="number"
          min="1"
          step="1"
          value={config.recency_decay.half_life_days}
          onChange={(e) => handleHalfLifeChange(e.target.value)}
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
      </div>

      {/* Heat Map Gradient */}
      <div>
        <h3 className="text-white font-medium mb-3">Heat Map Gradient</h3>
        <p className="text-white/60 text-sm mb-3">
          4 ascending values (0-1) for color intensity mapping
        </p>
        <div className="grid grid-cols-4 gap-3">
          {config.heat_map_gradient.map((value, index) => (
            <div key={index}>
              <label className="block text-white/60 text-xs mb-2">
                Level {index + 1}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) => handleGradientChange(index, e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40 text-sm"
              />
            </div>
          ))}
        </div>
        <p className="text-white/50 text-xs mt-2">
          ⚠️ Values must be in ascending order
        </p>
      </div>
    </div>
  );
}

