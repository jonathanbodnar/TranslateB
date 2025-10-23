import React from 'react';
import { IntakeConfig } from '../types';

interface IntakeSectionProps {
  config: IntakeConfig;
  onChange: (config: IntakeConfig) => void;
}

export function IntakeSection({ config, onChange }: IntakeSectionProps) {
  const handleFlowChange = (
    field: keyof IntakeConfig['flow'],
    value: string
  ) => {
    const numValue = field === 'summary_confirm_min_confidence' 
      ? parseFloat(value)
      : parseInt(value, 10);
    
    if (!isNaN(numValue)) {
      onChange({
        ...config,
        flow: {
          ...config.flow,
          [field]: numValue,
        },
      });
    }
  };

  const handleIntensityChange = (
    field: keyof IntakeConfig['intensity'],
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...config,
        intensity: {
          ...config.intensity,
          [field]: numValue,
        },
      });
    }
  };

  const handleFunctionChange = (
    func: keyof IntakeConfig['functions'],
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({
        ...config,
        functions: {
          ...config.functions,
          [func]: numValue,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">Intake Configuration</h2>
        <p className="text-white/60 text-sm mb-6">
          Configure quiz flow parameters and scoring
        </p>
      </div>

      {/* Flow Settings */}
      <div>
        <h3 className="text-white font-medium mb-3">Quiz Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">
              Min Cards
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={config.flow.min_cards}
              onChange={(e) => handleFlowChange('min_cards', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">
              Max Cards
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={config.flow.max_cards}
              onChange={(e) => handleFlowChange('max_cards', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">
              Min Confidence
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={config.flow.summary_confirm_min_confidence}
              onChange={(e) =>
                handleFlowChange('summary_confirm_min_confidence', e.target.value)
              }
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
            />
          </div>
        </div>
        <p className="text-white/50 text-xs mt-2">
          ⚠️ Min cards must be ≤ Max cards
        </p>
      </div>

      {/* Intensity Scoring */}
      <div>
        <h3 className="text-white font-medium mb-3">Intensity Scoring</h3>
        <p className="text-white/60 text-sm mb-3">
          Points awarded for each answer type
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Up</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={config.intensity.up}
              onChange={(e) => handleIntensityChange('up', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Down</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={config.intensity.down}
              onChange={(e) => handleIntensityChange('down', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Neither</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={config.intensity.neither}
              onChange={(e) => handleIntensityChange('neither', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
            />
          </div>
        </div>
      </div>

      {/* Function Weights */}
      <div>
        <h3 className="text-white font-medium mb-3">Function Weights</h3>
        <p className="text-white/60 text-sm mb-3">
          Weight for each cognitive function (0-2)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['Se', 'Ne', 'Si', 'Ni', 'Te', 'Ti', 'Fe', 'Fi'] as const).map(
            (func) => (
              <div key={func}>
                <label className="block text-white/80 text-sm mb-2">{func}</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.functions[func]}
                  onChange={(e) => handleFunctionChange(func, e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

