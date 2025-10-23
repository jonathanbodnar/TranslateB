import React from 'react';
import { UIConfig } from '../types';

interface UISectionProps {
  config: UIConfig;
  onChange: (config: UIConfig) => void;
}

export function UISection({ config, onChange }: UISectionProps) {
  const handleFieldChange = (field: keyof UIConfig, value: string | number) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">UI Configuration</h2>
        <p className="text-white/60 text-sm mb-6">
          Configure UI appearance and behavior
        </p>
      </div>

      {/* Animation Speed Factor */}
      <div>
        <label className="block text-white/80 text-sm mb-2">
          Animation Speed Factor
        </label>
        <p className="text-white/60 text-xs mb-3">
          Multiplier for animation durations (1.0 = normal speed)
        </p>
        <input
          type="number"
          min="0.1"
          max="3"
          step="0.1"
          value={config.animation_speed_factor}
          onChange={(e) =>
            handleFieldChange('animation_speed_factor', parseFloat(e.target.value))
          }
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>Faster (0.5x)</span>
          <span>Normal (1.0x)</span>
          <span>Slower (2.0x)</span>
        </div>
      </div>

      {/* Bar Display Limit */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Bar Display Limit</label>
        <p className="text-white/60 text-xs mb-3">
          Maximum number of items to show in lists (e.g., top N fears)
        </p>
        <input
          type="number"
          min="1"
          max="10"
          step="1"
          value={config.bar_display_limit}
          onChange={(e) =>
            handleFieldChange('bar_display_limit', parseInt(e.target.value, 10))
          }
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
      </div>

      {/* Theme Palette */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Theme Palette</label>
        <p className="text-white/60 text-xs mb-3">
          Color scheme identifier for the application
        </p>
        <input
          type="text"
          value={config.theme_palette}
          onChange={(e) => handleFieldChange('theme_palette', e.target.value)}
          placeholder="indigo_glass"
          className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
        />
      </div>

      {/* Info Box */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <p className="text-purple-300 text-sm">
          <strong>Note:</strong> UI changes affect the visual appearance and behavior of
          the application but don't impact core functionality. Theme palette changes may
          require a page refresh.
        </p>
      </div>
    </div>
  );
}

