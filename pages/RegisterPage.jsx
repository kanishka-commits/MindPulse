// src/pages/RegisterPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../src/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useQuiz } from '../context/QuizContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { dispatch } = useQuiz();

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'START_QUIZ', payload: result.user.email });
      navigate('/quiz');
    } catch (error) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="form-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password (min 6 chars)" required />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
