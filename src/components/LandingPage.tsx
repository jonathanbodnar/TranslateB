import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Brain, Users, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="min-h-screen gradient-primary flex flex-col items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Orb */}
      <motion.div 
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 gradient-orb rounded-full floating-orb"
        variants={itemVariants}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent shimmering" />
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
          Easy communication
          <br />
          <span className="bg-gradient-to-r from-pink-300 to-blue-300 bg-clip-text text-transparent">
            with AI.
          </span>
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
          onClick={() => navigate('/translator')}
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
          onClick={() => navigate('/translator')}
        >
          <MessageCircle className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Quick Translator</h3>
          <p className="text-secondary text-xs">What you really meant</p>
        </motion.div>

        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/quiz')}
        >
          <Brain className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Personality Quiz</h3>
          <p className="text-secondary text-xs">Discover your style</p>
        </motion.div>

        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/relationships')}
        >
          <Users className="w-8 h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold text-sm mb-1">Relationship Web</h3>
          <p className="text-secondary text-xs">Map connections</p>
        </motion.div>

        <motion.div 
          className="glass-card p-4 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/profile')}
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
    </motion.div>
  );
};

export default LandingPage;
