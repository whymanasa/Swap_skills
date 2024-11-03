import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/sign-up" />; // Redirect to sign-up if not authenticated
};

export default ProtectedRoute;