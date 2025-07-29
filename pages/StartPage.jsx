import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="page-center">
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Mind Pulse!</h1>
        <p className={styles.description}>
          Test your knowledge across multiple domains with 15 curated questions.
          <br />
          🕒 You have 30 minutes to complete the quiz.
          <br />
          🎯 Aim for accuracy — results will be shared instantly!
        </p>

        <div className={styles.authButtons}>
          <button
            className={styles.button}
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            className={styles.button}
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
