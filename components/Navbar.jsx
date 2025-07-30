import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const { dispatch } = useQuiz();

  const handleLogout = () => {
    // Clear all authentication & quiz-related data
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('guest');
    localStorage.removeItem('quizData'); // Clear the saved quiz progress
    localStorage.removeItem('lastVisitedPath');
    // Reset context state
    dispatch({ type: 'RESET_QUIZ' });

    // Navigate to home/login page
    navigate('/');
  };

  const toggleDarkMode = () => {
    // Toggles 'dark-mode' class on the body
    document.body.classList.toggle('dark-mode');
    // Persist theme preference
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>🧠 Mind Pulse</div>

      <div className={styles.actions}>
        <button onClick={toggleDarkMode} className={styles.navButton}>
          Toggle Theme
        </button>

        <button onClick={handleLogout} className={`${styles.navButton} ${styles.logoutButton}`}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
