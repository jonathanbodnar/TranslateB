import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, toggleQuestion } from '../api/adminClient';
import { Question, CreateQuestionRequest, UpdateQuestionRequest } from '../types';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../../../config/analyticsEvents';

/**
 * QuizManager Page
 * Manage intake quiz questions (create, edit, delete, toggle)
 */
export default function QuizManager() {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    track(ANALYTICS_EVENTS.ADMIN.QUIZ_MANAGER_OPENED, {});
    loadQuestions();
  }, [track]);

  async function loadQuestions() {
    try {
      const data = await getQuestions();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingQuestion(null);
    setIsEditorOpen(true);
  }

  function handleEdit(question: Question) {
    setEditingQuestion(question);
    setIsEditorOpen(true);
  }

  async function handleToggle(question: Question) {
    try {
      await toggleQuestion(question.id);
      await loadQuestions();
    } catch (err) {
      console.error('Failed to toggle question:', err);
      alert('Failed to toggle question');
    }
  }

  async function handleDelete(question: Question) {
    if (!window.confirm(`Delete question "${question.headline}"?`)) {
      return;
    }

    try {
      await deleteQuestion(question.id);
      await loadQuestions();
    } catch (err) {
      console.error('Failed to delete question:', err);
      alert('Failed to delete question');
    }
  }

  async function handleSave(data: CreateQuestionRequest | UpdateQuestionRequest) {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, data as UpdateQuestionRequest);
      } else {
        await createQuestion(data as CreateQuestionRequest);
      }
      setIsEditorOpen(false);
      await loadQuestions();
    } catch (err) {
      console.error('Failed to save question:', err);
      throw err;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen gradient-primary p-4 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="glass-button p-2 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold">Quiz Questions</h1>
        <button
          onClick={handleCreate}
          className="glass-button p-2 rounded-full"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {error && (
          <div className="glass-card p-4 border-l-4 border-red-500">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Question List */}
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            className="glass-card p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start gap-4">
              {/* Question Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${question.is_active ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                  <span className="text-xs text-white/60 uppercase">{question.category}</span>
                </div>
                <h3 className="text-white font-medium mb-2">{question.headline}</h3>
                <div className="flex gap-4 text-sm text-white/70">
                  <div>
                    <span className="text-white/50">Left: </span>
                    {question.left_label}
                  </div>
                  <div>
                    <span className="text-white/50">Right: </span>
                    {question.right_label}
                  </div>
                </div>
                {question.helper_text && (
                  <p className="text-white/60 text-sm mt-2">{question.helper_text}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(question)}
                  className="glass-button p-2 rounded"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleToggle(question)}
                  className={`glass-button p-2 rounded ${question.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'}`}
                  title={question.is_active ? 'Disable' : 'Enable'}
                >
                  {question.is_active ? (
                    <Power className="w-4 h-4 text-green-400" />
                  ) : (
                    <PowerOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(question)}
                  className="glass-button p-2 rounded hover:bg-red-500/20"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {questions.length === 0 && !loading && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/60 mb-4">No questions yet</p>
            <button
              onClick={handleCreate}
              className="glass-button px-4 py-2"
            >
              Create First Question
            </button>
          </div>
        )}
      </div>

      {/* Question Editor Modal */}
      <QuestionEditor
        isOpen={isEditorOpen}
        question={editingQuestion}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
      />
    </motion.div>
  );
}

/**
 * QuestionEditor Component
 * Modal for creating/editing questions
 */
interface QuestionEditorProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onSave: (data: CreateQuestionRequest | UpdateQuestionRequest) => Promise<void>;
}

function QuestionEditor({ isOpen, question, onClose, onSave }: QuestionEditorProps) {
  const [formData, setFormData] = useState<{
    id: string;
    headline: string;
    left_label: string;
    right_label: string;
    helper_text: string;
    category: 'communication' | 'relationship' | 'personality' | 'fear';
    is_active: boolean;
  }>({
    id: '',
    headline: '',
    left_label: '',
    right_label: '',
    helper_text: '',
    category: 'communication',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setFormData({
        id: question.id,
        headline: question.headline,
        left_label: question.left_label,
        right_label: question.right_label,
        helper_text: question.helper_text || '',
        category: question.category,
        is_active: question.is_active,
      });
    } else {
      setFormData({
        id: '',
        headline: '',
        left_label: '',
        right_label: '',
        helper_text: '',
        category: 'communication',
        is_active: true,
      });
    }
    setError(null);
  }, [question, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (question) {
        // Update - don't send ID
        await onSave({
          headline: formData.headline,
          left_label: formData.left_label,
          right_label: formData.right_label,
          helper_text: formData.helper_text || null,
          category: formData.category,
          is_active: formData.is_active,
        });
      } else {
        // Create - send ID
        await onSave(formData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-xl font-semibold mb-6">
            {question ? 'Edit Question' : 'Create Question'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!question && (
              <div>
                <label className="block text-white/80 text-sm mb-2">Question ID*</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="q_example_1"
                  required
                  className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-3 outline-none focus:border-white/40"
                />
                <p className="text-white/50 text-xs mt-1">Unique identifier (e.g., q_conflict_approach_1)</p>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm mb-2">Headline*</label>
              <textarea
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="When facing a difficult conversation, I tend to:"
                required
                rows={2}
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-3 outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Left Label*</label>
                <input
                  type="text"
                  value={formData.left_label}
                  onChange={(e) => setFormData({ ...formData, left_label: e.target.value })}
                  placeholder="Think logically first"
                  required
                  className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-3 outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Right Label*</label>
                <input
                  type="text"
                  value={formData.right_label}
                  onChange={(e) => setFormData({ ...formData, right_label: e.target.value })}
                  placeholder="Focus on emotions first"
                  required
                  className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-3 outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Helper Text (Optional)</label>
              <input
                type="text"
                value={formData.helper_text}
                onChange={(e) => setFormData({ ...formData, helper_text: e.target.value })}
                placeholder="Additional context or guidance"
                className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-lg p-3 outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Category*</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                required
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-3 outline-none focus:border-white/40"
              >
                <option value="communication">Communication</option>
                <option value="relationship">Relationship</option>
                <option value="personality">Personality</option>
                <option value="fear">Fear</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-white">Active (visible in quiz)</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 glass-button px-4 py-3 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 hover:shadow-lg transition-all"
              >
                {saving ? 'Saving...' : question ? 'Update Question' : 'Create Question'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

