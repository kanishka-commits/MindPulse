// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDRsy-pa5zU4vByPAFF6kAdmDt9tuYYemA",
    authDomain: "mind-pulse-quiz.firebaseapp.com",
    projectId: "mind-pulse-quiz",
    storageBucket: "mind-pulse-quiz.firebasestorage.app",
    messagingSenderId: "371832164119",
    appId: "1:371832164119:web:0b0c466b71a3c793b27152",
    measurementId: "G-MBDJTLNX5D"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


export { auth, googleProvider, githubProvider };
