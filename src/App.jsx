import { Analytics } from "@vercel/analytics/react"
import { Routes, Route, useLocation  } from 'react-router-dom';
import { QuizProvider } from '../context/QuizContext';
import StartPage from '../pages/StartPage';
import QuizPage from '../pages/QuizPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ReportPage from '../pages/ReportPage';
import ProtQuizRoute from '../components/ProtQuizRoute';
import ProtReportRoute from '../components/ProtReportRoute';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import RestoreLastRoute from '../components/RestoreLastRoute';
import './index.css';

// ✅ A new component to cleanly manage Navbar logic
const NavbarController = () => {
  const location = useLocation();

  // 1. Define routes that get complete Navbar
  const limitedNavbarRoutes = ['/quiz', '/report']; // Add any other app pages here
  if (limitedNavbarRoutes.includes(location.pathname)) {
    return <Navbar/>; // Assumes default showLogout is true
  }

  // 2. All other routes get the limited Navbar 
  // This correctly handles the home page ('/') AND any random/undefined paths.
  return <Navbar  showLogout={false} />; 
};

function App() {
  const location = useLocation(); 
    // Store route changes
    useEffect(() => {
      localStorage.setItem('lastVisitedPath', location.pathname);
    }, [location.pathname]);
  return (
    <QuizProvider>
      <div className="app-container">
      <NavbarController />
      
        
        
        <RestoreLastRoute />
        <Routes>
          <Route path="/quiz" element={<ProtQuizRoute> <QuizPage /> </ProtQuizRoute>} />
          <Route path="/report" element={<ProtReportRoute><ReportPage /> </ProtReportRoute>} />

          {/* This catch-all route should be LAST */}
          {/* It handles both '/' and any random path like '/asdasd' */}
          <Route path="*" element={<StartPage />} />
        </Routes>
      </div>
      <Analytics />
    </QuizProvider>
  );
}

export default App;