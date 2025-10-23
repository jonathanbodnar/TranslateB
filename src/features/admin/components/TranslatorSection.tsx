import React from 'react';
import { TranslatorConfig } from '../types';

interface TranslatorSectionProps {
  config: TranslatorConfig;
  onChange: (config: TranslatorConfig) => void;
}

export function TranslatorSection({ config, onChange }: TranslatorSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">Translator Configuration</h2>
        <p className="text-white/60 text-sm mb-6">
          Configure translator modes and features
        </p>
      </div>

      {/* Default Mode */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Default Mode</label>
        <p className="text-white/60 text-xs mb-3">
          Number of listener modes shown by default
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="default_mode"
              value="4"
              checked={config.default_mode === '4'}
              onChange={(e) =>
                onChange({ ...config, default_mode: e.target.value as '4' | '8' })
              }
              className="w-4 h-4"
            />
            <span className="text-white">4 Modes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="default_mode"
              value="8"
              checked={config.default_mode === '8'}
              onChange={(e) =>
                onChange({ ...config, default_mode: e.target.value as '4' | '8' })
              }
              className="w-4 h-4"
            />
            <span className="text-white">8 Modes</span>
          </label>
        </div>
      </div>

      {/* Enable Advanced */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enable_advanced}
            onChange={(e) =>
              onChange({ ...config, enable_advanced: e.target.checked })
            }
            className="w-5 h-5"
          />
          <div>
            <span className="text-white font-medium">Enable Advanced Mode</span>
            <p className="text-white/60 text-xs mt-1">
              Allow users to toggle between 4 and 8 listener modes
            </p>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> The default mode determines which option is pre-selected
          when users access WIMTS/Translator. If advanced mode is disabled, users cannot
          switch modes.
        </p>
      </div>
    </div>
  );
}

