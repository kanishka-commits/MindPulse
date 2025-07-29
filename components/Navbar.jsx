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
    localStorage.removeItem('user');
    localStorage.removeItem('guest');
    localStorage.removeItem('quizState'); // if you're storing it
    localStorage.removeItem('answers');   // if answers are persisted
    localStorage.removeItem('currentQuestion'); // if tracked

    // Reset context
    dispatch({ type: 'RESET_QUIZ' });

    // Navigate to home/login
    navigate('/');
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>🧠 Mind Pulse</div>

      <div className={styles.actions}>
        <button onClick={toggleDarkMode} className={styles.navButton}>
          Toggle Dark Mode
        </button>

        <button onClick={handleLogout} className={styles.navButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;


// import React from 'react'

// const Navbar = () => {
//   return (
//     <>
//     <button
//         onClick={() => {
//             localStorage.removeItem('token'); // if also removing login token
//             localStorage.removeItem('guest');
//             navigate('/'); // redirect to homepage or login
//         }}
//         >
//         Logout
//     </button>

//     </>
//   )
// }

// export default Navbar