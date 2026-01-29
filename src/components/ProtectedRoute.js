import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireProfile = true }) => {
  const { isAuthenticated, hasUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!requireProfile) {
    if (!hasUser) return <Navigate to="/login" replace />;
  } else {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
