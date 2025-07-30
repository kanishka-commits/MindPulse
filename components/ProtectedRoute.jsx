// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext'; // Assuming you add auth state here

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useQuiz(); // Get auth state from the context

  // The logic is cleaner and tied to your app's state
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;