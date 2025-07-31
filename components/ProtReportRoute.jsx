import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const ProtReportRoute = ({ children }) => {
  // Check if the quiz report data exists in sessionStorage.
  const quizData = sessionStorage.getItem('quizReportData');

  // If there's no data, redirect to the home page.
  // Otherwise, render the children (the ReportPage).
  return quizData ? children : <Navigate to="/" replace />;
};

export default ProtReportRoute;