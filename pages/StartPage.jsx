import React from 'react';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="page-center">
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
