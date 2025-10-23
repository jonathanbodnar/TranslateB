import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminRole } from '../hooks/useAdminRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Wraps admin routes to ensure only admins can access them
 * Redirects non-admin users to home page
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, loading } = useAdminRole();

  // Show loading state while checking role
  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    console.warn('Access denied: User is not an admin');
    return <Navigate to="/" replace />;
  }

  // Render children if admin
  return <>{children}</>;
}

