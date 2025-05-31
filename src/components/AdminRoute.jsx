import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-lime-500 text-xl">Loading...</div>
      </div>
    );
  }

  console.log('AdminRoute - Current user:', user?.email);
  
  // Check if user is admin (admin@mcnutrition.com)
  if (!user || user.email !== 'admin@mcnutrition.com') {
    console.log('AdminRoute - Access denied, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute - Access granted');
  return children;
};

export default AdminRoute; 