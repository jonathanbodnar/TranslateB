import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Check, Edit, Trash2, Wand2, ClipboardList } from 'lucide-react';
import { Contact, ContactSliders, updateContact, deleteContact } from '../api/contactsClient';
import { getPresetForType, hasCustomValues as checkHasCustomValues } from '../constants/presets';
import { QuizModal } from './QuizModal';
import { QuizAnalysis } from '../api/quizClient';

interface ContactDetailDrawerProps {
  contact: Contact | null;
  sliders: ContactSliders | null;
  onClose: () => void;
  onSave: (sliders: ContactSliders) => Promise<void>;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const CORE_SLIDERS = [
  { key: 'directness', label: 'Directness vs. Cushioning', min: 'Very Cushioned', max: 'Very Direct' },
  { key: 'formality', label: 'Formality vs. Closeness', min: 'Very Formal', max: 'Very Close' },
  { key: 'warmth', label: 'Warmth vs. Affection', min: 'Very Warm', max: 'Very Affectionate' },
  { key: 'support', label: 'Support Mode', min: 'Pure Listening', max: 'Problem-Solving' },
  { key: 'humor', label: 'Humor', min: 'No Humor', max: 'Constant Humor' },
  { key: 'teasing', label: 'Teasing/Edginess', min: 'No Teasing', max: 'Heavy Teasing' },
];

const ADVANCED_SLIDERS = [
  { key: 'listening_style', label: 'Listening Style', min: 'Active Listening', max: 'Offering Solutions' },
  { key: 'response_timing', label: 'Response Timing', min: 'Immediate', max: 'Let Them Sit' },
  { key: 'emotional_expression', label: 'Emotional Expression', min: 'Reserved', max: 'Very Expressive' },
  { key: 'problem_depth', label: 'Problem Discussion', min: 'Surface Level', max: 'Deep Dive' },
  { key: 'accountability', label: 'Accountability', min: 'Gentle', max: 'Hold Accountable' },
  { key: 'reassurance_level', label: 'Reassurance', min: 'Minimal', max: 'Constant' },
  { key: 'conversation_initiation', label: 'Conversation Initiation', min: 'Wait for Them', max: 'Always Initiate' },
  { key: 'vulnerability', label: 'Vulnerability', min: 'Private', max: 'Very Open' },
  { key: 'feedback_style', label: 'Feedback Style', min: 'Sandwich Approach', max: 'Direct Feedback' },
];

const RELATIONSHIP_TYPES = [
  'Partner', 'Spouse', 'Friend', 'Best Friend', 
  'Family', 'Boss', 'Colleague', 'Acquaintance', 'Other'
];

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  contact,
  sliders,
  onClose,
  onSave,
  onDelete,
  onUpdate
}) => {
  // Local state for optimistic updates
  const [localSliders, setLocalSliders] = useState<ContactSliders | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'core' | 'advanced'>('core');
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  
  // Preset state
  const [showPresetConfirm, setShowPresetConfirm] = useState(false);
  const [presetToApply, setPresetToApply] = useState<Omit<ContactSliders, 'contact_id'> | null>(null);
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);

  // Update local state when sliders prop changes
  useEffect(() => {
    setLocalSliders(sliders);
    setHasChanges(false);
    setSaved(false);
  }, [sliders]);

  // Initialize edit fields when contact changes
  useEffect(() => {
    if (contact) {
      setEditName(contact.name);
      setEditType(contact.relationship_type || '');
      setIsEditing(false);
    }
  }, [contact]);

  // Handle slider change (local state only, no auto-save)
  const handleSliderChange = (sliderName: string, value: number) => {
    // Update local state immediately for smooth UX
    setLocalSliders(prev => prev ? { ...prev, [sliderName]: value } : null);
    setHasChanges(true);
    setSaved(false);
  };

  // Manual save button handler
  const handleSave = async () => {
    if (!localSliders || !hasChanges) return;

    setSaving(true);
    try {
      // Save all sliders in a single batch call
      await onSave(localSliders);
      
      setSaved(true);
      setHasChanges(false);
      
      // Reset saved indicator after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save sliders:', err);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit save
  const handleSaveEdit = async () => {
    if (!contact) return;

    try {
      await updateContact(contact.id, {
        name: editName,
        relationship_type: editType
      });
      
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to update contact:', err);
      alert('Failed to update contact');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!contact) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${contact.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteContact(contact.id);
      onClose();
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      alert('Failed to delete contact');
    }
  };

  // Handle apply preset
  const handleApplyPreset = () => {
    if (!contact?.relationship_type) {
      alert('Please set a relationship type first');
      return;
    }

    const preset = getPresetForType(contact.relationship_type);
    if (!preset) {
      alert('No preset available for this relationship type');
      return;
    }

    // Check if user has customized sliders
    const hasCustom = checkHasCustomValues(localSliders);

    if (hasCustom) {
      setPresetToApply(preset);
      setShowPresetConfirm(true);
    } else {
      applyPreset(preset);
    }
  };

  // Apply preset to sliders
  const applyPreset = (preset: Omit<ContactSliders, 'contact_id'>) => {
    if (!localSliders) return;

    setLocalSliders({
      ...localSliders,
      ...preset,
    });
    setHasChanges(true);
    setShowPresetConfirm(false);
    setPresetToApply(null);
  };
  
  // Handle quiz completion
  const handleQuizComplete = (analysis: QuizAnalysis) => {
    // Apply AI-recommended slider values from quiz
    if (!contact) return;
    
    setLocalSliders({
      contact_id: contact.id,
      directness: analysis.communicationStyle.directness,
      formality: analysis.communicationStyle.formality,
      warmth: analysis.communicationStyle.warmth,
      support: analysis.communicationStyle.supportMode,
      humor: analysis.communicationStyle.humor,
      teasing: analysis.communicationStyle.teasing,
      listening_style: analysis.communicationStyle.validationVsSolutioning,
      response_timing: analysis.communicationStyle.metaCommunication,
      emotional_expression: analysis.communicationStyle.warmth, // Reuse warmth
      problem_depth: analysis.communicationStyle.detailDepth,
      accountability: analysis.communicationStyle.boundaryStrength,
      reassurance_level: analysis.communicationStyle.encouragementVsChallenge,
      conversation_initiation: analysis.communicationStyle.questionDensity,
      vulnerability: analysis.communicationStyle.structureVsStory,
      feedback_style: analysis.communicationStyle.directness, // Reuse directness
    });
    
    setHasChanges(true);
    setSaved(false);
    setShowQuiz(false);
    
    // Automatically save after quiz
    setTimeout(() => {
      handleSave();
    }, 500);
  };

  if (!contact) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-black/20 backdrop-blur-sm border-b border-white/10 p-6 z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xl font-semibold placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="Contact name"
                    />
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white/80 text-sm focus:outline-none focus:border-white/40"
                    >
                      <option value="" className="bg-gray-800">Select type...</option>
                      {RELATIONSHIP_TYPES.map(type => (
                        <option key={type} value={type} className="bg-gray-800">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <h2 className="text-white text-2xl font-semibold">{contact.name}</h2>
                    <p className="text-white/60">{contact.relationship_type || 'Contact'}</p>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {!isEditing ? (
                  <>
                    {/* Save Status Indicator */}
                    {saved && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1 text-green-400 text-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Saved</span>
                      </motion.div>
                    )}
                    {saving && (
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <div className="loading-spinner w-4 h-4" />
                        <span>Saving...</span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="p-2 rounded-lg bg-white/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title="Take relationship quiz"
                    >
                      <ClipboardList className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleApplyPreset}
                      className="p-2 rounded-lg bg-white/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                      title={`Apply ${contact.relationship_type || 'default'} preset`}
                    >
                      <Wand2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                      title="Edit contact"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 rounded-lg bg-white/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(contact.name);
                        setEditType(contact.relationship_type || '');
                      }}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white/80 text-sm hover:bg-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600"
                    >
                      Save
                    </button>
                  </>
                )}
                <button onClick={onClose} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab('core')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'core'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Core (6)
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'advanced'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Advanced (9)
              </button>
            </div>

            <p className="text-white/50 text-xs mb-6">
              Adjust the sliders below and click "Save Changes" when ready
            </p>

            {localSliders ? (
              <>
                {(activeTab === 'core' ? CORE_SLIDERS : ADVANCED_SLIDERS).map(slider => (
                  <div key={slider.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-white/80 text-sm">{slider.label}</label>
                      <span className="text-white/60 text-sm">
                        {localSliders[slider.key as keyof ContactSliders] || 50}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localSliders[slider.key as keyof ContactSliders] || 50}
                      onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{slider.min}</span>
                      <span>{slider.max}</span>
                    </div>
                  </div>
                ))}

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      hasChanges && !saving
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {saving ? (
                      <>
                        <div className="loading-spinner w-5 h-5" />
                        <span>Saving...</span>
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="loading-spinner w-8 h-8" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Preset Confirmation Modal */}
      {showPresetConfirm && presetToApply && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPresetConfirm(false)}
        >
          <motion.div
            className="glass-card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-xl font-semibold mb-3">
              Apply {contact.relationship_type} Preset?
            </h3>
            <p className="text-white/70 mb-4 text-sm">
              This will replace your current slider values with the recommended settings for {contact.relationship_type}. Your custom changes will be lost.
            </p>

            {/* Preview key differences */}
            <div className="bg-white/5 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
              <p className="text-white/60 text-sm mb-2 font-medium">Preview changes:</p>
              <div className="space-y-1 text-xs">
                {Object.entries(presetToApply).map(([key, value]) => {
                  const currentValue = localSliders?.[key as keyof ContactSliders] || 50;
                  const diff = (value as number) - (currentValue as number);
                  if (diff === 0) return null;

                  return (
                    <div key={key} className="flex justify-between text-white/70">
                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className={diff > 0 ? 'text-green-400' : 'text-orange-400'}>
                        {currentValue} → {value} ({diff > 0 ? '+' : ''}{diff})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPresetConfirm(false);
                  setPresetToApply(null);
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => applyPreset(presetToApply)}
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-colors"
              >
                Apply Preset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          contactId={contact.id}
          contactName={contact.name}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </AnimatePresence>
  );
};

