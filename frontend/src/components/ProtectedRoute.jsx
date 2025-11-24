import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = authAPI.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
