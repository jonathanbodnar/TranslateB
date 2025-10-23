import React, { useState } from 'react';
import { useAuthGate } from '../features/auth/context/AuthGateContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/supabase';

const ProfileIcon: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { open, isUserLoggedIn, user, isAdmin } = useAuthGate();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      await auth.signOut();
      
      // Clear all local storage
      localStorage.clear();
      
      // Close dropdown
      setShowDropdown(false);
      
      // Redirect to landing page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if logout fails
      localStorage.clear();
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleWimtsClick = () => {
    navigate('/wimts');
    setShowDropdown(false);
  }

  const handleRelationshipClick = () => {
    navigate('/relationships');
    setShowDropdown(false);
  }

  const handleAdminClick = () => {
    navigate('/admin');
    setShowDropdown(false);
  };

  const handleLoginClick = () => {
    open();
    setShowDropdown(false);
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          {isUserLoggedIn && user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 glass-card p-2 rounded-lg shadow-lg z-50">
            {isUserLoggedIn ? (
              <>
                <div className="px-3 py-2 text-white/80 text-sm border-b border-white/10">
                  {user?.email || 'User'}
                </div>
                <button
                  onClick={handleWimtsClick}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  Quick Translator
                </button>
                <button
                  onClick={handleRelationshipClick}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  Relationship Web
                </button>
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  View Profile
                </button>
                {isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm border-t border-white/10 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  Login / Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ProfileIcon;
