import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Clock, User, HelpCircle } from 'lucide-react';
import { getConfig } from '../api/adminClient';
import { AdminConfig } from '../types';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { ANALYTICS_EVENTS } from '../../../config/analyticsEvents';

/**
 * AdminDashboard Page
 * Overview page showing current config status and quick actions
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track page view
    track(ANALYTICS_EVENTS.ADMIN.DASHBOARD_VIEWED, {});

    async function loadConfig() {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (err) {
        console.error('Failed to load config:', err);
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [track]);

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

  if (error || !config) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <div className="glass-card p-6 max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error || 'Configuration not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="glass-button px-4 py-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(config.updated_at || config.created_at).toLocaleString();

  return (
    <motion.div
      className="min-h-screen gradient-primary p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-6">
        <button
          onClick={() => navigate('/')}
          className="glass-button p-2 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold">Admin Panel</h1>
        <div className="w-10" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="glass-card p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-medium">Config ID</h3>
            </div>
            <p className="text-white/60 text-sm">{config.config_id}</p>
          </motion.div>

          <motion.div
            className="glass-card p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-medium">Last Updated</h3>
            </div>
            <p className="text-white/60 text-sm">{formattedDate}</p>
          </motion.div>

          <motion.div
            className="glass-card p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-medium">Updated By</h3>
            </div>
            <p className="text-white/60 text-sm truncate">
              {config.author_user_id 
                ? `${config.author_user_id.substring(0, 8)}...`
                : 'System'}
            </p>
          </motion.div>
        </div>

        {/* Notes (if any) */}
        {config.notes && (
          <motion.div
            className="glass-card p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-white font-medium mb-2">Latest Notes</h3>
            <p className="text-white/70 text-sm">{config.notes}</p>
          </motion.div>
        )}

        {/* Configuration Sections */}
        <motion.div
          className="glass-card p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-white font-medium mb-4">Configuration Sections</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(config.payload).map((section) => (
              <div
                key={section}
                className="bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <p className="text-white text-sm font-medium capitalize">
                  {section}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {Object.keys((config.payload as any)[section]).length} settings
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate('/admin/config')}
            className="glass-button px-6 py-4 text-lg font-medium"
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Edit Configuration
          </button>
          <button
            onClick={() => navigate('/admin/quiz')}
            className="glass-button px-6 py-4 text-lg font-medium"
          >
            <HelpCircle className="w-5 h-5 inline-block mr-2" />
            Manage Quiz Questions
          </button>
        </motion.div>

        {/* Warning */}
        <motion.div
          className="glass-card p-4 border-l-4 border-yellow-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-white/80 text-sm">
            ⚠️ <strong>Note:</strong> Configuration changes will overwrite the current
            settings. There is no version history or undo functionality.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

