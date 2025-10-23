import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, RefreshCw } from 'lucide-react';
import { getConfig, updateConfig } from '../api/adminClient';
import { ConfigPayload, ValidationError } from '../types';
import { ValidationErrors } from '../components/ValidationErrors';
import { CognitiveSection } from '../components/CognitiveSection';
import { FearSection } from '../components/FearSection';
import { IntakeSection } from '../components/IntakeSection';
import { TranslatorSection } from '../components/TranslatorSection';
import { ShareSection } from '../components/ShareSection';
import { UISection } from '../components/UISection';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../../../config/analyticsEvents';

/**
 * ConfigEditor Page
 * Main page for editing admin configuration
 * Tabbed interface with validation and save functionality
 */
export default function ConfigEditor() {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  
  const [config, setConfig] = useState<ConfigPayload | null>(null);
  const [originalConfig, setOriginalConfig] = useState<ConfigPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [notes, setNotes] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof ConfigPayload>('cognitive');

  useEffect(() => {
    track(ANALYTICS_EVENTS.ADMIN.CONFIG_EDITOR_OPENED, {});

    async function loadConfig() {
      try {
        const data = await getConfig();
        setConfig(data.payload);
        setOriginalConfig(JSON.parse(JSON.stringify(data.payload)));
      } catch (err) {
        console.error('Failed to load config:', err);
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [track]);

  useEffect(() => {
    if (config && originalConfig) {
      const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
      setHasChanges(changed);
    }
  }, [config, originalConfig]);

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    setValidationErrors([]);
    setError(null);

    try {
      const response = await updateConfig(config, notes || undefined);
      
      if (response.validation_errors && response.validation_errors.length > 0) {
        setValidationErrors(response.validation_errors);
        track(ANALYTICS_EVENTS.ADMIN.CONFIG_VALIDATION_FAILED, {
          errors: response.validation_errors.length,
        });
        return;
      }

      // Success
      setOriginalConfig(JSON.parse(JSON.stringify(config)));
      setHasChanges(false);
      setNotes('');
      track(ANALYTICS_EVENTS.ADMIN.CONFIG_UPDATED, {});
      
      // Show success message briefly then navigate back
      alert('Configuration saved successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save config:', err);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges && !window.confirm('Discard all changes?')) {
      return;
    }
    if (originalConfig) {
      setConfig(JSON.parse(JSON.stringify(originalConfig)));
      setNotes('');
      setValidationErrors([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-sm">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="glass-card p-6 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin')}
            className="glass-button px-4 py-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!config) return null;

  const tabs: Array<{ key: keyof ConfigPayload; label: string; icon: string }> = [
    { key: 'cognitive', label: 'Cognitive', icon: '🧠' },
    { key: 'fear', label: 'Fear', icon: '😰' },
    { key: 'intake', label: 'Intake', icon: '📋' },
    { key: 'translator', label: 'Translator', icon: '🔄' },
    { key: 'share', label: 'Share', icon: '📤' },
    { key: 'ui', label: 'UI', icon: '🎨' },
  ];

  return (
    <motion.div
      className="min-h-screen gradient-primary pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-purple-900/90 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 pt-12">
          <button
            onClick={() => navigate('/admin')}
            className="glass-button p-2 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-semibold">Edit Configuration</h1>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="px-4 mt-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 max-w-4xl mx-auto">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <ValidationErrors errors={validationErrors} />
        )}

        {/* Error Message */}
        {error && (
          <div className="glass-card p-4 mb-4 border-l-4 border-red-500">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Active Section */}
        <div className="glass-card p-6">
          {activeTab === 'cognitive' && (
            <CognitiveSection
              config={config.cognitive}
              onChange={(cognitive) => setConfig({ ...config, cognitive })}
            />
          )}
          {activeTab === 'fear' && (
            <FearSection
              config={config.fear}
              onChange={(fear) => setConfig({ ...config, fear })}
            />
          )}
          {activeTab === 'intake' && (
            <IntakeSection
              config={config.intake}
              onChange={(intake) => setConfig({ ...config, intake })}
            />
          )}
          {activeTab === 'translator' && (
            <TranslatorSection
              config={config.translator}
              onChange={(translator) => setConfig({ ...config, translator })}
            />
          )}
          {activeTab === 'share' && (
            <ShareSection
              config={config.share}
              onChange={(share) => setConfig({ ...config, share })}
            />
          )}
          {activeTab === 'ui' && (
            <UISection
              config={config.ui}
              onChange={(ui) => setConfig({ ...config, ui })}
            />
          )}
        </div>

        {/* Notes */}
        <div className="glass-card p-6 mt-4">
          <label className="block text-white font-medium mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your changes..."
            className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-3 outline-none focus:border-white/40 resize-none"
            rows={3}
            maxLength={500}
          />
          <p className="text-white/60 text-xs mt-1">{notes.length}/500</p>
        </div>
      </div>

      {/* Sticky Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-transparent backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={handleDiscard}
            disabled={!hasChanges || saving}
            className="glass-button px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 inline-block mr-2" />
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 inline-block mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline-block mr-2" />
                Save Configuration
              </>
            )}
          </button>
        </div>
        {hasChanges && (
          <p className="text-center text-white/60 text-xs mt-2">
            You have unsaved changes
          </p>
        )}
      </div>
    </motion.div>
  );
}

