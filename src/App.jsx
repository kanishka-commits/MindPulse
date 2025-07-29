import { Routes, Route, useLocation  } from 'react-router-dom';
import { QuizProvider } from '../context/QuizContext';
import StartPage from '../pages/StartPage';
import QuizPage from '../pages/QuizPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ReportPage from '../pages/ReportPage';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

function App() {
  const location = useLocation(); 
  return (
    <QuizProvider>
      <div className="app-container">
      {!['/', '/login', '/register'].includes(location.pathname) && <Navbar />}
        <Routes>
        

          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/quiz" element={<ProtectedRoute> <QuizPage /> </ProtectedRoute>} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </QuizProvider>
  );
}

export default App;
