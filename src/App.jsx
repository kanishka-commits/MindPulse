import { Routes, Route } from 'react-router-dom';
import { QuizProvider } from '../context/QuizContext';
import StartPage from '../pages/StartPage';
// import QuizPage from '../pages/QuizPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
// import ReportPage from '../pages/ReportPage';

function App() {
  return (
    <QuizProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/quiz" element={<QuizPage />} /> */}
          {/* <Route path="/report" element={<ReportPage />} /> */}
        </Routes>
      </div>
    </QuizProvider>
  );
}

export default App;
