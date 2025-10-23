import React from 'react';
import { CognitiveConfig } from '../types';

interface CognitiveSectionProps {
  config: CognitiveConfig;
  onChange: (config: CognitiveConfig) => void;
}

export function CognitiveSection({ config, onChange }: CognitiveSectionProps) {
  const handleAxisWeightChange = (axis: keyof CognitiveConfig['axis_weights'], value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...config,
        axis_weights: {
          ...config.axis_weights,
          [axis]: numValue,
        },
      });
    }
  };

  const handleFieldChange = (field: keyof Omit<CognitiveConfig, 'axis_weights'>, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...config,
        [field]: numValue,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">Cognitive Configuration</h2>
        <p className="text-white/60 text-sm mb-6">
          Configure weights and factors for cognitive profile generation
        </p>
      </div>

      {/* Axis Weights */}
      <div>
        <h3 className="text-white font-medium mb-3">Axis Weights</h3>
        <p className="text-white/60 text-sm mb-3">Weight each cognitive axis (0-2)</p>
        <div className="grid grid-cols-2 gap-4">
          {(['N', 'S', 'T', 'F'] as const).map((axis) => (
            <div key={axis}>
              <label className="block text-white/80 text-sm mb-2">{axis}</label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.axis_weights[axis]}
                onChange={(e) => handleAxisWeightChange(axis, e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shadow Factor */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Shadow Factor</label>
        <p className="text-white/60 text-xs mb-2">Strength of shadow functions (0-1)</p>
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={config.shadow_factor}
          onChange={(e) => handleFieldChange('shadow_factor', e.target.value)}
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
      </div>

      {/* Trigger Threshold */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Trigger Threshold</label>
        <p className="text-white/60 text-xs mb-2">Minimum score to identify triggers (0-1)</p>
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={config.trigger_threshold}
          onChange={(e) => handleFieldChange('trigger_threshold', e.target.value)}
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
      </div>

      {/* Blindspot Decay Rate */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Blindspot Decay Rate</label>
        <p className="text-white/60 text-xs mb-2">How blindspots fade over time (0-1)</p>
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={config.blindspot_decay_rate}
          onChange={(e) => handleFieldChange('blindspot_decay_rate', e.target.value)}
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
      </div>
    </div>
  );
}

