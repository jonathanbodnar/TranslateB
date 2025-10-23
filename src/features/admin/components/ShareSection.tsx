import React, { useState } from 'react';
import { ShareConfig } from '../types';

interface ShareSectionProps {
  config: ShareConfig;
  onChange: (config: ShareConfig) => void;
}

export function ShareSection({ config, onChange }: ShareSectionProps) {
  const [newTemplate, setNewTemplate] = useState('');

  const handleAddTemplate = () => {
    if (newTemplate.trim() && !config.card_templates.includes(newTemplate.trim())) {
      onChange({
        ...config,
        card_templates: [...config.card_templates, newTemplate.trim()],
      });
      setNewTemplate('');
    }
  };

  const handleRemoveTemplate = (template: string) => {
    onChange({
      ...config,
      card_templates: config.card_templates.filter((t) => t !== template),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-semibold mb-4">Share Configuration</h2>
        <p className="text-white/60 text-sm mb-6">
          Configure sharing features and templates
        </p>
      </div>

      {/* Card Templates */}
      <div>
        <label className="block text-white/80 text-sm mb-2">Card Templates</label>
        <p className="text-white/60 text-xs mb-3">
          Available template IDs for insight cards
        </p>
        
        {/* Template List */}
        <div className="space-y-2 mb-3">
          {config.card_templates.map((template) => (
            <div
              key={template}
              className="flex items-center justify-between bg-white/10 rounded-lg p-3 border border-white/10"
            >
              <span className="text-white font-mono text-sm">{template}</span>
              <button
                onClick={() => handleRemoveTemplate(template)}
                className="text-red-400 hover:text-red-300 text-sm px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add New Template */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            placeholder="template_id"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTemplate()}
            className="flex-1 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-2 outline-none focus:border-white/40"
          />
          <button
            onClick={handleAddTemplate}
            disabled={!newTemplate.trim()}
            className="glass-button px-4 py-2 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Public Wall */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.public_wall_enabled}
            onChange={(e) =>
              onChange({ ...config, public_wall_enabled: e.target.checked })
            }
            className="w-5 h-5"
          />
          <div>
            <span className="text-white font-medium">Enable Public Wall</span>
            <p className="text-white/60 text-xs mt-1">
              Allow users to post insights to a public feed
            </p>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 text-sm">
          <strong>Note:</strong> Template IDs must match the templates defined in your
          share generation logic. Invalid template IDs will cause errors when users try to
          share.
        </p>
      </div>
    </div>
  );
}

