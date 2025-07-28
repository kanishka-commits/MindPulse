import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../src/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
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

  const handleSocialAuth = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider); // Same logic for login or account creation
      dispatch({ type: 'START_QUIZ', payload: result.user.email });
      navigate('/quiz');
    } catch (error) {
      alert("Authentication failed: " + error.message);
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

      <button className="social-btn google-btn" onClick={() => handleSocialAuth(googleProvider)}>Continue with Google</button>
      <button className="social-btn github-btn" onClick={() => handleSocialAuth(githubProvider)}>Continue with GitHub</button>
    </div>
  );
}

export default LoginPage;
