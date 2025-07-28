// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../src/firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useQuiz } from '../context/QuizContext';

function LoginPage() {
  const navigate = useNavigate();
  const { dispatch } = useQuiz();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'START_QUIZ', payload: result.user.email });
      navigate('/quiz');
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch({ type: 'START_QUIZ', payload: result.user.email });
      navigate('/quiz');
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="form-page">
      <h2>Login</h2>
      <form onSubmit={handleEmailLogin} className="auth-form">
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <div className="divider"><span>OR</span></div>

      <button className="social-btn google-btn" onClick={() => handleSocialLogin(googleProvider)}>Sign in with Google</button>
      <button className="social-btn github-btn" onClick={() => handleSocialLogin(githubProvider)}>Sign in with GitHub</button>
    </div>
  );
}

export default LoginPage;
