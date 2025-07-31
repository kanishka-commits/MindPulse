import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './QuizPage.module.css';
import { decodeHTMLEntities, formatTime } from '../src/utils/helpers';
import ConfirmLeaveModal from '../components/ConfirmLeaveModal';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

function QuizPage() {
  const allowNavigationRef = useRef(false); // NEW: track if we allow leaving
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visited, setVisited] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [loading, setLoading] = useState(true);

  const shuffle = useMemo(() => (array) => [...array].sort(() => Math.random() - 0.5), []);
  const [isBlocking, setIsBlocking] = useState(true);


  // 🔐 Prompt on tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isBlocking) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isBlocking]);
  useEffect(() => {
    const savedData = localStorage.getItem('quizData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setQuestions(parsed.questions || []);
      setAnswers(parsed.answers || {});
      setCurrentQuestion(parsed.currentQuestion || 0);
      setVisited(parsed.visited || [0]);
      setTimeLeft(parsed.timeLeft || 1800);
      setLoading(false);
    } else {
      axios.get('https://opentdb.com/api.php?amount=15&type=multiple')
        .then((res) => {
          const formattedQuestions = res.data.results.map((q) => ({
            ...q,
            all_answers: shuffle([...q.incorrect_answers, q.correct_answer]),
          }));
          setQuestions(formattedQuestions);
          setVisited([0]);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch questions:", err);
          setLoading(false);
        });
    }
  }, [shuffle]);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        'quizData',
        JSON.stringify({ questions, answers, currentQuestion, visited, timeLeft })
      );
    }
  }, [questions, answers, currentQuestion, visited, timeLeft]);

  useEffect(() => {
    if (!visited.includes(currentQuestion)) {
      setVisited((prev) => [...prev, currentQuestion]);
    }
  }, [currentQuestion, visited]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Block the back button initially
    window.history.pushState(null, '', window.location.pathname);
  
    const handlePopState = () => {
      if (!allowNavigationRef.current) {
        setShowConfirm(true);
        // ❌ Don't re-push to history here — it cancels real navigation
      }
    };
  
    const handleBeforeUnload = (e) => {
      if (!allowNavigationRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  


  const handleConfirmLeave = () => {
    localStorage.setItem('skipRestore', 'true'); // prevent immediate redirect back
    allowNavigationRef.current = true;
    setShowConfirm(false);
  
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 50);
  };
  
  
  

  const handleStay = () => {
    setShowConfirm(false);
  };

  const handleAnswer = (index, answer) => {
    setAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleSubmit = () => {
    allowNavigationRef.current = true; 
    localStorage.removeItem('quizData');
    navigate('/report', { state: { questions, answers } });
  };

  if (loading) return <div className={styles.loadingScreen}>Loading Quiz...</div>;

  const currentQ = questions[currentQuestion];

  return (
    <div className={styles.quizPage}>
      <div className={styles.quizContainer}>
        <div className={styles.quizHeader}>
          <h2 className={styles.title}>Mind Pulse Quiz</h2>
          <div className={styles.timer}>⏱️ {formatTime(timeLeft)}</div>
        </div>

        <div className={styles.quizLayout}>
          <div className={styles.questionArea}>
            {currentQ && (
              <div className={styles.questionCard}>
                <h3 className={styles.questionText}>
                  <span>Q{currentQuestion + 1}:</span> {decodeHTMLEntities(currentQ.question)}
                </h3>
                <ul className={styles.optionsList}>
                  {currentQ.all_answers.map((option, i) => (
                    <li key={i}>
                      <label className={styles.optionLabel}>
                        <input
                          type="radio"
                          name={`q${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswer(currentQuestion, option)}
                        />
                        <span>{decodeHTMLEntities(option)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.navigationButtons}>
              <button
                className={styles.navButton}
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((q) => q - 1)}
              >
                Previous
              </button>
              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit Quiz
              </button>
              <button
                className={styles.navButton}
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion((q) => q + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className={styles.navigationPanel}>
            <h4 className={styles.panelTitle}>Question Overview</h4>
            <div className={styles.overviewGrid}>
              {questions.map((_, i) => (
                <button
                  key={i}
                  className={`
                    ${styles.overviewButton}
                    ${answers[i] ? styles.answered : ''}
                    ${!answers[i] && visited.includes(i) ? styles.visited : ''}
                    ${currentQuestion === i ? styles.current : ''}
                  `}
                  onClick={() => setCurrentQuestion(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmLeaveModal
          onConfirm={handleConfirmLeave}
          onCancel={handleStay}
        />
      )}
    </div>
  );
}

export default QuizPage;
