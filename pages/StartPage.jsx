import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();
  // const [darkMode, setDarkMode] = useState(() => {
  //   // Check localStorage for dark mode preference
  //   const stored = localStorage.getItem('darkMode');
  //   return stored ? JSON.parse(stored) : false;
  // });

  // useEffect(() => {
  //   // Apply dark mode class to body
  //   if (darkMode) {
  //     document.body.classList.add('dark');
  //   } else {
  //     document.body.classList.remove('dark');
  //   }
  //   // Store preference
  //   localStorage.setItem('darkMode', JSON.stringify(darkMode));
  // }, [darkMode]);

  // const toggleDarkMode = () => {
  //   setDarkMode(prev => !prev);
  // };

  

  return (
    
    <div className="page-center">
      {/* <h1 className="app-title">🧠 QuizMaster</h1>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button> */}
      <div className="start-container">
        <h1>Welcome to the Mind Pulse!</h1>
        <p className="quiz-description">
          Test your knowledge across multiple domains with 15 curated questions.
          <br />
          🕒 You have 30 minutes to complete the quiz.
          <br />
          🎯 Aim for accuracy — results will be shared instantly!
        </p>

        <div className="auth-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
