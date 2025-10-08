import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BarChart, Edit, Save, Plus, Trash2 } from 'lucide-react';
import { QuizQuestion, QuizTemplate } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'quiz-editor' | 'analytics'>('overview');
  const [selectedQuiz, setSelectedQuiz] = useState<'quick' | 'deep'>('quick');
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Mock admin data
  const [stats] = useState({
    totalUsers: 1247,
    completedQuizzes: 3891,
    completedTranslations: 7623,
    activeUsers: 89
  });

  const [quizTemplates, setQuizTemplates] = useState<QuizTemplate[]>([
    {
      id: 'quick-1',
      name: 'Quick Onboarding Quiz',
      type: 'quick',
      version: 3,
      published: true,
      questions: [
        {
          id: 'q1',
          text: 'When facing a difficult conversation, I tend to:',
          variants: ['How do you approach tough talks?'],
          type: 'swipe',
          answers: [
            {
              id: 'q1a',
              text: 'Think through what I want to say logically first',
              bucketWeights: { thinking: 7, sensing: 2, intuition: 1, feeling: 0 }
            },
            {
              id: 'q1b', 
              text: 'Focus on how the other person might feel',
              bucketWeights: { feeling: 8, intuition: 1, sensing: 1, thinking: 0 }
            }
          ]
        }
      ],
      scoringFormula: {
        aggregationMethod: 'sum',
        normalization: true,
        topKLogic: 2,
        tieBreaking: 'highest'
      }
    }
  ]);

  const handleSaveQuestion = (question: QuizQuestion) => {
    setQuizTemplates(prev => prev.map(template => {
      if (template.type === selectedQuiz) {
        return {
          ...template,
          questions: template.questions.map(q => q.id === question.id ? question : q)
        };
      }
      return template;
    }));
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuizTemplates(prev => prev.map(template => {
      if (template.type === selectedQuiz) {
        return {
          ...template,
          questions: template.questions.filter(q => q.id !== questionId)
        };
      }
      return template;
    }));
  };

  const currentTemplate = quizTemplates.find(t => t.type === selectedQuiz);

  return (
    <motion.div 
      className="min-h-screen gradient-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 pt-12 mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button 
          onClick={() => navigate('/')}
          className="glass-button p-2 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold">Admin Dashboard</h1>
        <div className="w-10" />
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="px-4 mb-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-card p-2 flex">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart },
            { id: 'quiz-editor', label: 'Quiz Editor', icon: Edit },
            { id: 'analytics', label: 'Analytics', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="px-4 pb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Total Users</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stats.activeUsers}</div>
                <div className="text-white/60 text-sm">Active Now</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stats.completedQuizzes.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Quizzes Completed</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stats.completedTranslations.toLocaleString()}</div>
                <div className="text-white/60 text-sm">Translations</div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Quiz Templates</h3>
              {quizTemplates.map(template => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg mb-3">
                  <div>
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <p className="text-white/60 text-sm">
                      Version {template.version} • {template.questions.length} questions • 
                      {template.published ? ' Published' : ' Draft'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedQuiz(template.type);
                        setActiveTab('quiz-editor');
                      }}
                      className="glass-button p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quiz Editor Tab */}
        {activeTab === 'quiz-editor' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Quiz Type Selector */}
            <div className="glass-card p-4 mb-6">
              <h3 className="text-white text-lg font-semibold mb-4">Select Quiz to Edit</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedQuiz('quick')}
                  className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                    selectedQuiz === 'quick'
                      ? 'bg-white/20 text-white border-2 border-white/30'
                      : 'bg-white/10 text-white/70 border-2 border-transparent hover:bg-white/15'
                  }`}
                >
                  <div className="font-semibold">Quick Onboarding</div>
                  <div className="text-sm opacity-80">4 cards max</div>
                </button>
                <button
                  onClick={() => setSelectedQuiz('deep')}
                  className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                    selectedQuiz === 'deep'
                      ? 'bg-white/20 text-white border-2 border-white/30'
                      : 'bg-white/10 text-white/70 border-2 border-transparent hover:bg-white/15'
                  }`}
                >
                  <div className="font-semibold">Deep Dive</div>
                  <div className="text-sm opacity-80">Expanded profiling</div>
                </button>
              </div>
            </div>

            {/* Questions List */}
            {currentTemplate && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">
                    {currentTemplate.name} Questions
                  </h3>
                  <button className="glass-button p-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {currentTemplate.questions.map((question, index) => (
                    <div key={question.id} className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white/60 text-sm">Question {index + 1}</span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {question.type}
                            </span>
                          </div>
                          <h4 className="text-white font-medium mb-2">{question.text}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="glass-button p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="glass-button p-2 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {question.answers.map(answer => (
                          <div key={answer.id} className="bg-white/10 rounded p-3">
                            <p className="text-white/90 text-sm mb-2">{answer.text}</p>
                            <div className="flex gap-4 text-xs">
                              <span className="text-pink-300">F: {answer.bucketWeights.feeling}</span>
                              <span className="text-green-300">S: {answer.bucketWeights.sensing}</span>
                              <span className="text-purple-300">I: {answer.bucketWeights.intuition}</span>
                              <span className="text-blue-300">T: {answer.bucketWeights.thinking}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                  <button className="glass-button px-6 py-3 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Publish Changes
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-card p-6 mb-6">
              <h3 className="text-white text-lg font-semibold mb-4">Personality Distribution</h3>
              <div className="space-y-4">
                {[
                  { bucket: 'feeling', percentage: 35, color: 'from-pink-400 to-red-400' },
                  { bucket: 'thinking', percentage: 28, color: 'from-blue-400 to-cyan-400' },
                  { bucket: 'sensing', percentage: 22, color: 'from-green-400 to-emerald-400' },
                  { bucket: 'intuition', percentage: 15, color: 'from-purple-400 to-indigo-400' }
                ].map(({ bucket, percentage, color }) => (
                  <div key={bucket}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium capitalize">{bucket}</span>
                      <span className="text-white/80">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Usage Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white">Average Quiz Completion Time</span>
                  <span className="text-white/80">3.2 minutes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white">Translation Success Rate</span>
                  <span className="text-white/80">87%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white">User Retention (7 days)</span>
                  <span className="text-white/80">64%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Question Editor Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-white text-xl font-bold mb-6">Edit Question</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-white/60 text-sm block mb-2">Question Text</label>
                <textarea
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    text: e.target.value
                  })}
                  className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-white/40 h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm block mb-2">Answer Options</label>
                {editingQuestion.answers.map((answer, index) => (
                  <div key={answer.id} className="bg-white/10 rounded-lg p-4 mb-3">
                    <textarea
                      value={answer.text}
                      onChange={(e) => {
                        const newAnswers = [...editingQuestion.answers];
                        newAnswers[index] = { ...answer, text: e.target.value };
                        setEditingQuestion({ ...editingQuestion, answers: newAnswers });
                      }}
                      className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-white/40 mb-3"
                    />
                    
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(answer.bucketWeights).map(([bucket, weight]) => (
                        <div key={bucket}>
                          <label className="text-white/60 text-xs capitalize">{bucket}</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={weight}
                            onChange={(e) => {
                              const newAnswers = [...editingQuestion.answers];
                              newAnswers[index] = {
                                ...answer,
                                bucketWeights: {
                                  ...answer.bucketWeights,
                                  [bucket]: parseInt(e.target.value) || 0
                                }
                              };
                              setEditingQuestion({ ...editingQuestion, answers: newAnswers });
                            }}
                            className="w-full bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-sm outline-none focus:border-white/40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingQuestion(null)}
                className="glass-button flex-1 py-3 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveQuestion(editingQuestion)}
                className="glass-button flex-1 py-3 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
