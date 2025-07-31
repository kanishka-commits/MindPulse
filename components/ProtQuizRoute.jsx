// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext'; // Assuming you add auth state here

const ProtQuizRoute = ({ children }) => {
  const { isAuthenticated } = useQuiz(); // Get auth state from the context
  /*
   If the user is authenticated, render the children (the QuizPage),
   If there's no data, redirect to the home page, Otherwise, render the children (the ReportPage)
   */
  return isAuthenticated ? children : <Navigate to="/" replace />;

};

export default ProtQuizRoute;




//   
  
// };

// export default ProtReportRoute;