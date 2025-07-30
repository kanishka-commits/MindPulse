//ReportPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ReportPage.module.css'; // Import the new CSS module

// Helper to decode HTML entities like &quot;
function decodeHTMLEntities(text) {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Provide a fallback for state to prevent errors if the user navigates here directly
  const { questions, answers } = location.state || { questions: [], answers: {} };

  // Redirect if there's no data to display
  if (!questions || questions.length === 0) {
    return (
      <div className={styles.reportPage}>
        <div className={styles.reportContainer}>
          <h2 className={styles.header}>⚠️ No Quiz Data Available</h2>
          <p>It looks like you've landed here without completing a quiz.</p>
          <button onClick={() => navigate('/')} className={styles.homeButton}>
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const score = questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.correct_answer ? 1 : 0);
  }, 0);

  const total = questions.length;

  return (
    <div className={styles.reportPage}>
      <div className={styles.reportContainer}>
        <h2 className={styles.header}>📋 Quiz Report</h2>
        <p className={styles.score}>
          You scored <strong>{score}</strong> out of <strong>{total}</strong>
        </p>

        <div className={styles.reviewSection}>
          {questions.map((q, i) => {
            const correctAnswer = q.correct_answer;
            const userAnswer = answers[i];
            const isUnanswered = userAnswer === null || userAnswer === undefined;

            return (
              <div key={i} className={styles.questionBlock}>
                <h4 className={styles.questionText}>
                  <span>Q{i + 1}:</span> {decodeHTMLEntities(q.question)}
                </h4>

                <ul className={styles.optionsList}>
                  {q.all_answers.map((option, idx) => {
                    const isCorrect = option === correctAnswer;
                    const isSelected = userAnswer === option;

                    // Determine the class for styling based on the answer's status
                    const optionClass = isCorrect
                      ? styles.correct
                      : isSelected
                      ? styles.incorrect
                      : styles.normal;

                    return (
                      <li key={idx} className={optionClass}>
                        {decodeHTMLEntities(option)}
                        {isCorrect && " ✅"}
                        {isSelected && !isCorrect && " ❌"}
                      </li>
                    );
                  })}
                </ul>

                {isUnanswered && (
                  <p className={styles.unanswered}>
                    ⚠️ You did not answer this question.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <button onClick={() => navigate('/')} className={styles.homeButton}>
            🏠 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
