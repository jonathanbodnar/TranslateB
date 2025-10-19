import React, { useState } from 'react';
import { useAuthGate } from '../features/auth/context/AuthGateContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/supabase';

const ProfileIcon: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { open, isUserLoggedIn, user } = useAuthGate();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
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
                  onClick={handleProfileClick}
                  className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded text-sm"
                >
                  View Profile
                </button>
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
