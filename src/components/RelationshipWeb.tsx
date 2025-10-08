import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, User, Heart, Briefcase, Users, Home, Edit3 } from 'lucide-react';
import { Relationship } from '../types';

const RelationshipWeb: React.FC = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  
  // Mock relationships data
  const [relationships] = useState<Relationship[]>([
    {
      id: '1',
      name: 'Sarah',
      relationshipType: 'Partner',
      emotionalCloseness: 9,
      affectionLevel: 8,
      context: 'My wife - we communicate well but sometimes struggle during stress',
      inferredProfile: {
        buckets: { feeling: 60, sensing: 20, intuition: 15, thinking: 5 },
        fears: ['abandonment'],
        longings: ['security'],
        copingMechanisms: ['talking'],
        tonePreference: 'tender',
        processingLens: 'feeling'
      }
    },
    {
      id: '2',
      name: 'Mike',
      relationshipType: 'Boss',
      emotionalCloseness: 4,
      affectionLevel: 6,
      context: 'My manager - very analytical, prefers direct communication',
      inferredProfile: {
        buckets: { thinking: 70, sensing: 20, feeling: 5, intuition: 5 },
        fears: ['inefficiency'],
        longings: ['results'],
        copingMechanisms: ['planning'],
        tonePreference: 'blunt',
        processingLens: 'thinking'
      }
    },
    {
      id: '3',
      name: 'Emma',
      relationshipType: 'Friend',
      emotionalCloseness: 7,
      affectionLevel: 8,
      context: 'Best friend since college - very intuitive and creative',
      inferredProfile: {
        buckets: { intuition: 50, feeling: 30, thinking: 15, sensing: 5 },
        fears: ['conformity'],
        longings: ['authenticity'],
        copingMechanisms: ['creating'],
        tonePreference: 'poetic',
        processingLens: 'intuition'
      }
    }
  ]);

  const getRelationshipIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'partner':
      case 'spouse':
        return <Heart className="w-5 h-5" />;
      case 'boss':
      case 'manager':
      case 'colleague':
        return <Briefcase className="w-5 h-5" />;
      case 'friend':
        return <Users className="w-5 h-5" />;
      case 'family':
        return <Home className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRelationshipColor = (closeness: number) => {
    if (closeness >= 8) return 'from-pink-400 to-red-400';
    if (closeness >= 6) return 'from-purple-400 to-indigo-400';
    if (closeness >= 4) return 'from-blue-400 to-cyan-400';
    return 'from-gray-400 to-gray-500';
  };

  const getPositionForIndex = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

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
        <h1 className="text-white text-xl font-semibold">Relationship Web</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="glass-button p-2 rounded-full"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      <div className="px-4 pb-8">
        {/* Relationship Web Visualization */}
        <motion.div 
          className="glass-card p-6 mb-6 h-80"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Your Connections</h3>
          
          <div className="relative w-full h-60">
            {/* Center - You */}
            <motion.div 
              className="absolute w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border-2 border-white/30"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>

            {/* Relationships */}
            {relationships.map((relationship, index) => {
              const position = getPositionForIndex(index, relationships.length);
              
              return (
                <motion.div
                  key={relationship.id}
                  className={`absolute w-12 h-12 bg-gradient-to-br ${getRelationshipColor(relationship.emotionalCloseness)} rounded-full flex items-center justify-center cursor-pointer`}
                  style={{ 
                    left: position.x - 24, 
                    top: position.y - 24 
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedRelationship(relationship)}
                >
                  {getRelationshipIcon(relationship.relationshipType)}
                  
                  {/* Connection Line */}
                  <svg 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      width: '300px', 
                      height: '300px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.line
                      x1="150"
                      y1="150"
                      x2={position.x}
                      y2={position.y}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Relationship List */}
        <motion.div 
          className="space-y-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {relationships.map((relationship, index) => (
            <motion.div
              key={relationship.id}
              className="glass-card p-4 cursor-pointer"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedRelationship(relationship)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getRelationshipColor(relationship.emotionalCloseness)} rounded-full flex items-center justify-center`}>
                  {getRelationshipIcon(relationship.relationshipType)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold">{relationship.name}</h4>
                    <span className="text-white/60 text-sm">{relationship.relationshipType}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-white/60 text-xs">Closeness:</span>
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                              i < relationship.emotionalCloseness ? 'bg-pink-400' : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm line-clamp-2">
                    {relationship.context}
                  </p>
                </div>
                
                <Edit3 className="w-4 h-4 text-white/40" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Relationship Detail Modal */}
      <AnimatePresence>
        {selectedRelationship && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRelationship(null)}
          >
            <motion.div 
              className="glass-card p-6 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${getRelationshipColor(selectedRelationship.emotionalCloseness)} rounded-full flex items-center justify-center`}>
                  {getRelationshipIcon(selectedRelationship.relationshipType)}
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">{selectedRelationship.name}</h3>
                  <p className="text-white/80">{selectedRelationship.relationshipType}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-white/60 text-sm">Emotional Closeness</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < selectedRelationship.emotionalCloseness ? 'bg-pink-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white text-sm">{selectedRelationship.emotionalCloseness}/10</span>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 text-sm">Context & Notes</label>
                  <p className="text-white/90 text-sm mt-1 p-3 bg-white/10 rounded-lg">
                    {selectedRelationship.context}
                  </p>
                </div>

                {selectedRelationship.inferredProfile && (
                  <div>
                    <label className="text-white/60 text-sm">Communication Style</label>
                    <div className="mt-2 p-3 bg-white/10 rounded-lg">
                      <p className="text-white/90 text-sm">
                        Primary: <span className="text-pink-300 font-semibold capitalize">
                          {selectedRelationship.inferredProfile.processingLens}
                        </span>
                      </p>
                      <p className="text-white/90 text-sm">
                        Tone: <span className="text-blue-300 font-semibold capitalize">
                          {selectedRelationship.inferredProfile.tonePreference}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    // Navigate to translator with this person's context
                    navigate('/translator');
                  }}
                  className="glass-button py-3 font-medium"
                >
                  Translate For Them
                </button>
                <button
                  onClick={() => setSelectedRelationship(null)}
                  className="glass-button py-3 font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Relationship Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-card p-6 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-white text-xl font-bold mb-6">Add New Relationship</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-white/60 text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter their name"
                    className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-white/40"
                  />
                </div>
                
                <div>
                  <label className="text-white/60 text-sm block mb-2">Relationship Type</label>
                  <select className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-white/40">
                    <option value="">Select type</option>
                    <option value="Partner">Partner</option>
                    <option value="Friend">Friend</option>
                    <option value="Family">Family</option>
                    <option value="Boss">Boss</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm block mb-2">Context & Notes</label>
                  <textarea
                    placeholder="How do you communicate with them? Any patterns you've noticed?"
                    className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-white/40 h-20 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="glass-button py-3 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add relationship logic here
                    setShowAddForm(false);
                  }}
                  className="glass-button py-3 font-medium"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RelationshipWeb;
