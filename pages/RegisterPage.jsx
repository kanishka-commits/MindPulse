import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../src/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useQuiz } from '../context/QuizContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { dispatch } = useQuiz();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'START_QUIZ', payload: result.user.email });
      navigate('/quiz');
    } catch (error) {
      alert("Sign Up failed: " + error.message);
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider); // Firebase handles sign in/up automatically
      dispatch({ type: 'START_QUIZ', payload: result.user.email });
      navigate('/quiz');
    } catch (error) {
      alert("Authentication failed: " + error.message);
    }
  };

  return (
    <div className="form-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleEmailSignUp} className="auth-form">
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password (min 6 chars)" required />
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>

      <div className="divider"><span>OR</span></div>

      <button className="social-btn google-btn" onClick={() => handleSocialAuth(googleProvider)}>Continue with Google</button>
      <button className="social-btn github-btn" onClick={() => handleSocialAuth(githubProvider)}>Continue with GitHub</button>
    </div>
  );
}

export default RegisterPage;
