import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is admin and trying to access login/signup, redirect to admin panel
  if (user?.email === 'admin@mcnutrition.com' && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/admin" />;
  }

  // If user is logged in and trying to access login/signup, redirect to home
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute; 