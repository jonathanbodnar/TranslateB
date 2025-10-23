import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, User, Heart, Briefcase, Users, Home, Edit3 } from 'lucide-react';
import Constellation from '../features/contacts/components/Constellation';
import { 
  getContacts, 
  createContact, 
  getContactSliders, 
  updateContactSliders,
  Contact,
  ContactSliders 
} from '../features/contacts/api/contactsClient';
import { AddContactModal } from '../features/contacts/components/AddContactModal';
import { ContactDetailDrawer } from '../features/contacts/components/ContactDetailDrawer';
import { useAuth } from '../hooks/useAuth';
import { getPresetForType } from '../features/contacts/constants/presets';

const RelationshipWeb: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedSliders, setSelectedSliders] = useState<ContactSliders | null>(null);
  
  // Real data state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  // Fetch contacts on mount (only once)
  useEffect(() => {
    if (!user) return;
    
    // Only fetch once per session
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    
    async function fetchContacts() {
      try {
        setLoading(true);
        const data = await getContacts();
        setContacts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, [user]);

  // Fetch sliders when contact is selected
  useEffect(() => {
    if (!selectedContact) {
      setSelectedSliders(null);
      return;
    }

    async function fetchSliders() {
      if (!selectedContact) return;
      
      try {
        const sliders = await getContactSliders(selectedContact.id);
        setSelectedSliders(sliders);
      } catch (err) {
        console.error('Failed to fetch sliders:', err);
        setSelectedSliders(null);
      }
    }

    fetchSliders();
  }, [selectedContact]);

  // Handle add contact
  const handleAddContact = async (name: string, relationshipType: string) => {
    try {
      const result = await createContact({
        name,
        relationship_type: relationshipType
      });
      
      // Auto-apply preset for relationship type
      if (result.contact_id && relationshipType) {
        const preset = getPresetForType(relationshipType);
        if (preset) {
          try {
            await updateContactSliders(result.contact_id, preset);
          } catch (presetError) {
            console.error('Failed to apply preset:', presetError);
            // Don't fail contact creation if preset fails
          }
        }
      }
      
      // Refetch contacts to get the new one
      const updatedContacts = await getContacts();
      setContacts(updatedContacts);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to create contact:', err);
      alert('Failed to create contact');
    }
  };

  // Handle batch slider update
  const handleSlidersUpdate = async (updatedSliders: ContactSliders) => {
    if (!selectedContact) return;

    try {
      // Send only the slider values (exclude contact_id)
      const { contact_id: _contact_id, ...sliderValues} = updatedSliders;
      await updateContactSliders(selectedContact.id, sliderValues);

      // Update local state for immediate feedback
      setSelectedSliders(updatedSliders);
    } catch (err) {
      console.error('Failed to update sliders:', err);
      throw err; // Let the drawer handle the error
    }
  };

  // Handle contact delete or update - refresh the list
  const handleContactChange = async () => {
    try {
      const updatedContacts = await getContacts();
      setContacts(updatedContacts);
      setSelectedContact(null);
    } catch (err) {
      console.error('Failed to refresh contacts:', err);
    }
  };

  // Helper functions
  const getRelationshipIcon = (type?: string) => {
    const typeStr = (type || '').toLowerCase();
    switch (typeStr) {
      case 'partner':
      case 'spouse':
        return <Heart className="w-5 h-5 text-white" />;
      case 'boss':
      case 'manager':
      case 'colleague':
        return <Briefcase className="w-5 h-5 text-white" />;
      case 'friend':
      case 'best friend':
        return <Users className="w-5 h-5 text-white" />;
      case 'family':
        return <Home className="w-5 h-5 text-white" />;
      default:
        return <User className="w-5 h-5 text-white" />;
    }
  };

  // Auth guard
  if (!user) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-white text-xl mb-4">Please log in to view your relationship web</h2>
          <button 
            onClick={() => navigate('/')}
            className="glass-button px-6 py-2"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner w-12 h-12" />
          <p className="text-white/60">Loading your connections...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-white text-xl mb-4">{error}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="glass-button px-6 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (contacts.length === 0) {
    return (
      <motion.div 
        className="min-h-screen gradient-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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

        <div className="px-4 pb-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <motion.div 
            className="glass-card p-8 text-center max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-semibold mb-3">No Contacts Yet</h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              Start building your relationship web by adding your first contact. 
              Track communication styles and personalize your interactions.
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="glass-button px-6 py-3 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Contact
            </button>
          </motion.div>
        </div>

        {/* Add Contact Form Modal */}
        <AddContactModal 
          show={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddContact}
        />
      </motion.div>
    );
  }

  // Main view with contacts
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
        {/* Constellation Visualization */}
        <motion.div 
          className="glass-card h-full  p-6 mb-6 h-80"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4 text-center">
            Your Connections ({contacts.length})
          </h3>
          <Constellation
            relationships={contacts.map(c => ({
              id: c.id,
              name: c.name,
              relationshipType: c.relationship_type || 'Other',
              emotionalCloseness: 5 // Default for now, will be enhanced in Phase 3
            }))}
            onSelect={(rel) => {
              const found = contacts.find(c => c.id === rel.id);
              if (found) setSelectedContact(found);
            }}
          />
        </motion.div>

        {/* Contact List */}
        <motion.div 
          className="space-y-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4">All Contacts</h3>
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              className="glass-card p-4 cursor-pointer hover:bg-white/10 transition-colors"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
                    {getRelationshipIcon(contact.relationship_type)}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{contact.name}</h4>
                    <p className="text-white/60 text-sm">{contact.relationship_type || 'Contact'}</p>
                  </div>
                </div>
                <Edit3 className="w-5 h-5 text-white/40" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Contact Detail Drawer */}
      <ContactDetailDrawer
        contact={selectedContact}
        sliders={selectedSliders}
        onClose={() => setSelectedContact(null)}
        onSave={handleSlidersUpdate}
        onDelete={handleContactChange}
        onUpdate={handleContactChange}
      />

      {/* Add Contact Form Modal */}
      <AddContactModal 
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddContact}
      />
    </motion.div>
  );
};

export default RelationshipWeb;
