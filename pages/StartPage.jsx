import React, { useState, useEffect } from 'react';
// useEffect for checking URL on page load
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../src/firebaseConfig'; // Assuming firebaseConfig is in src/
import {
  sendSignInLinkToEmail, // send a login link via email
  signInWithEmailLink, // complete the login when user clicks the link
  isSignInWithEmailLink, // checks if the URL is a valid login link
  signInWithPopup, // login using popup (Google/GitHub)
} from 'firebase/auth';
import { useQuiz } from '../context/QuizContext';
import styles from './StartPage.module.css';
import Navbar from '../components/Navbar';

function StartPage() {
  // const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useQuiz();  // To start quiz when login is done
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- Login Handlers ---

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      
      // Added logic to persist session and start quiz
      localStorage.setItem('token', await result.user.getIdToken()); // Store a token for persistence
      localStorage.setItem('userEmail', userEmail);
      
      dispatch({ type: 'START_QUIZ', payload: userEmail });
      navigate('/quiz');
    } catch (err) {
      console.error('Social sign-in error:', err);
      setError('Login failed. Please try again.');
    }
  };

  const handleGuestLogin = () => {
    // Made localStorage clearing safer
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.setItem('guest', 'true');
    
    // The START_QUIZ action already resets the state, so RESET_QUIZ is not needed.
    dispatch({ type: 'START_QUIZ', payload: 'Guest User' });
    navigate('/quiz');
  };

  const handleSendLink = async () => {
    if (!email) {
      setError('Please enter an email address.');
      return;
    }
    setError('');
    setMessage('');

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) must be authorized
      // in the Firebase Console.
      url: window.location.origin, // Redirect to the base URL
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      setMessage(`Sign-in link sent to ${email}. Please check your inbox.`);
    } catch (err) {
      console.error(err);
      setError('Failed to send link. Please check the email and try again.');
    }
  };

  // --- Effect to handle user returning from email link ---

  useEffect(() => {
    const completeSignIn = async (emailToSignIn, url) => {
      try {
        const result = await signInWithEmailLink(auth, emailToSignIn, url);
        localStorage.removeItem('emailForSignIn'); // Clean up
        
        const userEmail = result.user.email;
        localStorage.setItem('token', await result.user.getIdToken());
        localStorage.setItem('userEmail', userEmail);
        
        // 4. Removed redundant RESET_QUIZ dispatch
        dispatch({ type: 'START_QUIZ', payload: userEmail });
        navigate('/quiz');
      } catch (err) {
        console.error('Login with email link failed:', err);
        setError('Login failed. The link may have expired or is invalid.');
      }
    };

    const url = window.location.href;
    if (isSignInWithEmailLink(auth, url)) {
      let emailFromStorage = localStorage.getItem('emailForSignIn');
      if (!emailFromStorage) {
        // This can happen if the user opens the link on a different device.
        emailFromStorage = window.prompt('Please provide your email for confirmation');
      }
      if (emailFromStorage) {
        completeSignIn(emailFromStorage, url);
      } else {
        setError("Could not complete sign-in without an email.");
      }
    }
  }, [dispatch, navigate]);
  return (
    <><Navbar showLogout={false} />
    <div className={styles.pageCenter}>
      
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Mind Pulse!</h1>
        <p className={styles.description}>
          Sign in with your email for a passwordless experience, or use a social account.
        </p>
        <div className={styles.emailForm}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.button} onClick={handleSendLink}>
            Send Sign-in Link
          </button>
        </div>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.divider}><span>OR</span></div>

        <div className={styles.socialButtons}>
            <button 
              onClick={() => handleSocialLogin(googleProvider)} 
              className={`${styles.socialBtn} ${styles.googleBtn}`}
            >
              Continue with Google
            </button>
            <button 
              onClick={() => handleSocialLogin(githubProvider)} 
              className={`${styles.socialBtn} ${styles.githubBtn}`}
            >
              Continue with GitHub
            </button>
            <button 
              onClick={handleGuestLogin} 
              className={styles.socialBtn} 
            >
              Continue as Guest
            </button>
        </div>
      </div>
    </div>
    </>
  );
}
export default StartPage;