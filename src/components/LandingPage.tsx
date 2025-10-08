import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Brain, Users, Sparkles } from 'lucide-react';
import SimpleWaves from './SimpleWaves';
import { useWindowSize } from '../hooks/useWindowSize';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  // Create ripple effect when menu items are clicked
  const handleMenuClick = useCallback((path: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create ripple at menu item center
    if ((window as any).createWaveRipple) {
      (window as any).createWaveRipple(x, y);
    }
    
    // Small delay to show ripple before navigation
    setTimeout(() => navigate(path), 150);
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Subtle Gradient Waves */}
      <motion.div 
        className="absolute inset-0 pointer-events-auto"
        variants={itemVariants}
      >
        <SimpleWaves 
          width={width}
          height={height}
          className="absolute inset-0"
        />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="text-center z-10 max-w-md mx-auto"
        variants={itemVariants}
      >
        <motion.h1 
          className="heading-primary mb-4"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
            Easier communication
          </span>
          <br />
          through deeper understanding.
        </motion.h1>

        <motion.p 
          className="text-secondary mb-8 text-center px-4"
          variants={itemVariants}
        >
          Discover what you really meant to say.
          <br />
          Enhance your relationships through deeper understanding.
        </motion.p>

        <motion.button
          className="glass-button px-8 py-4 text-lg font-semibold mb-8 w-full max-w-xs"
          variants={itemVariants}
          onClick={(e) => handleMenuClick('/translator', e)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Feature Cards */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mt-8 max-w-lg w-full px-4"
        variants={itemVariants}
      >
        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => handleMenuClick('/translator', e)}
        >
          <MessageCircle className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Quick Translator</h3>
          <p className="text-secondary text-xs">What you really meant</p>
        </motion.div>

        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => handleMenuClick('/quiz', e)}
        >
          <Brain className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Personality Quiz</h3>
          <p className="text-secondary text-xs">Discover your style</p>
        </motion.div>

        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => handleMenuClick('/relationships', e)}
        >
          <Users className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Relationship Web</h3>
          <p className="text-secondary text-xs">Map connections</p>
        </motion.div>

        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => handleMenuClick('/profile', e)}
        >
          <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Your Profile</h3>
          <p className="text-secondary text-xs">Personal insights</p>
        </motion.div>
      </motion.div>

      {/* Bottom Navigation Hint */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        variants={itemVariants}
      >
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
        </div>
      </motion.div>

      {/* Hidden Admin Access */}
      <motion.div 
        className="absolute bottom-2 right-4"
        variants={itemVariants}
      >
        <button
          onClick={() => navigate('/admin')}
          className="text-white/30 hover:text-white/60 text-xs transition-colors"
        >
          Admin
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
