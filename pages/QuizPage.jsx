// src/pages/QuizPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visited, setVisited] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  // Shuffle helper
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // Load saved quiz progress
  useEffect(() => {
    const savedData = localStorage.getItem('quizData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setQuestions(parsed.questions || []);
      setAnswers(parsed.answers || {});
      setCurrentQuestion(parsed.currentQuestion || 0);
      setVisited(parsed.visited || []);
      setTimeLeft(parsed.timeLeft || 1800);
    } else {
      // Fetch new quiz if no saved data
      axios.get('https://opentdb.com/api.php?amount=15').then((res) => {
        const data = res.data.results.map((q) => ({
          ...q,
          all_answers: shuffle([...q.incorrect_answers, q.correct_answer])
        }));
        setQuestions(data);
        // Save new quiz to localStorage
        localStorage.setItem(
          'quizData',
          JSON.stringify({
            questions: data,
            answers: {},
            currentQuestion: 0,
            visited: [],
            timeLeft: 1800
          })
        );
      });
    }
  }, []);

  // Save progress on answers / question change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        'quizData',
        JSON.stringify({ questions, answers, currentQuestion, visited, timeLeft })
      );
    }
  }, [answers, currentQuestion, visited, timeLeft]);

  // Mark question as visited
  useEffect(() => {
    if (!visited.includes(currentQuestion)) {
      setVisited((prev) => [...prev, currentQuestion]);
    }
  }, [currentQuestion]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = prev - 1;
        if (nextTime <= 0) {
          clearInterval(timer);
          handleSubmit();
        }
        return nextTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (index, answer) => {
    setAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleSubmit = () => {
    localStorage.removeItem('quizData');
    navigate('/report', { state: { questions, answers } });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!questions.length) return <p>Loading questions...</p>;

  return (
    <div className="quiz-page" style={{ padding: '1rem' }}>
      <div
        className="quiz-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2>🧠 Quiz Time</h2>
        <div className="timer">⏱️ Time Left: {formatTime(timeLeft)}</div>
      </div>

      {/* Layout */}
      <div
        className="quiz-layout"
        style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '2rem', marginTop: '1rem' }}
      >
        {/* Main Question Area */}
        <div className="question-area">
          <div className="question">
            <h3>
              Q{currentQuestion + 1}: {decodeHTMLEntities(questions[currentQuestion].question)}
            </h3>
            <ul>
              {questions[currentQuestion].all_answers.map((option, i) => (
                <li key={i}>
                  <label>
                    <input
                      type="radio"
                      name={`q${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={() => handleAnswer(currentQuestion, option)}
                    />
                    {decodeHTMLEntities(option)}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="navigation-buttons" style={{ marginTop: '1rem' }}>
            <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion((q) => q - 1)}>
              Previous
            </button>
            <button
              disabled={currentQuestion === questions.length - 1}
              onClick={() => setCurrentQuestion((q) => q + 1)}
            >
              Next
            </button>
            <button onClick={handleSubmit}>Submit Quiz</button>
          </div>
        </div>

        {/* Question Overview Panel */}
        <div className="navigation-panel" style={{ borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>
          <h4>Question Overview</h4>
          <div
            className="overview-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}
          >
            {questions.map((_, i) => (
              <button
                key={i}
                style={{
                  backgroundColor: answers[i]
                    ? '#90ee90'
                    : visited.includes(i)
                    ? '#f0e68c'
                    : '#f8f8f8',
                  border: '1px solid #ccc',
                  padding: '0.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestion(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
