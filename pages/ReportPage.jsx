import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './ReportPage.module.css';

// Helper to decode HTML entities (no changes needed)
const decodeHTMLEntities = (text) => {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

// --- Sub-components (no changes needed) ---
const ScoreSummary = ({ score, total }) => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.scoreSection}>
      <div className={styles.progressRing}>
        <svg className={styles.progressRingSvg} viewBox="0 0 120 120">
          <circle className={styles.progressRingBg} strokeWidth="8" r="45" cx="60" cy="60" />
          <circle
            className={styles.progressRingFg}
            strokeWidth="8"
            r="45"
            cx="60"
            cy="60"
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        </svg>
        <span className={styles.progressRingText}>{Math.round(percentage)}%</span>
      </div>
      <p className={styles.score}>
        You scored <strong>{score}</strong> out of <strong>{total}</strong>
      </p>
    </div>
  );
};
ScoreSummary.propTypes = { score: PropTypes.number.isRequired, total: PropTypes.number.isRequired };

const QuestionReview = React.memo(({ question, userAnswer, index }) => {
  const isUnanswered = userAnswer === null || userAnswer === undefined;
  return (
    <div className={styles.questionBlock}>
      <h4 className={styles.questionText}>
        <span>Q{index + 1}:</span> {decodeHTMLEntities(question.question)}
      </h4>
      <ul className={styles.optionsList}>
        {question.all_answers.map((option) => {
          const isCorrect = option === question.correct_answer;
          const isSelected = userAnswer === option;
          let optionClass = styles.normal;
          if (isCorrect) optionClass = styles.correct;
          else if (isSelected) optionClass = styles.incorrect;
          return (
            <li key={option} className={optionClass}>
              {decodeHTMLEntities(option)}
              {isCorrect && <span className={styles.icon}>✅</span>}
              {isSelected && !isCorrect && <span className={styles.icon}>❌</span>}
            </li>
          );
        })}
      </ul>
      {isUnanswered && <p className={styles.unanswered}>⚠️ You did not answer this question.</p>}
    </div>
  );
});
QuestionReview.propTypes = { question: PropTypes.object.isRequired, userAnswer: PropTypes.string, index: PropTypes.number.isRequired };
QuestionReview.displayName = 'QuestionReview';

const NoData = ({ onGoHome }) => (
  <div className={styles.reportPage}>
    <div className={styles.reportContainer}>
      <h2 className={styles.header}>⚠️ No Quiz Data Available</h2>
      <p>It seems you've navigated here directly without completing a quiz.</p>
      <button onClick={onGoHome} className={styles.homeButton}>Go Back to Home</button>
    </div>
  </div>
);
NoData.propTypes = { onGoHome: PropTypes.func.isRequired };

// --- Main ReportPage Component ---

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // **MODIFICATION**: Read from state OR fallback to sessionStorage
  const reportData = useMemo(() => {
    if (location.state) {
      return location.state; // Use data from initial navigation
    }
    const storedData = sessionStorage.getItem('quizReportData');
    return storedData ? JSON.parse(storedData) : null;
  }, [location.state]);

  const { questions, answers } = reportData || { questions: [], answers: {} };

  const score = useMemo(() => {
    if (!questions || !answers) return 0;
    return questions.reduce((acc, q, i) => acc + (answers[i] === q.correct_answer ? 1 : 0), 0);
  }, [questions, answers]);

  // **MODIFICATION**: Update the "Play Again" handler
  const handlePlayAgain = () => {
    sessionStorage.removeItem('quizReportData'); // Clean up storage
    navigate('/');
  };

  if (!questions || questions.length === 0) {
    return <NoData onGoHome={handlePlayAgain} />;
  }

  return (
    <div className={styles.reportPage}>
      <div className={styles.reportContainer}>
        <h2 className={styles.header}>📋 Quiz Report</h2>
        <ScoreSummary score={score} total={questions.length} />
        <div className={styles.reviewSection}>
          <h3 className={styles.reviewHeader}>Review Your Answers</h3>
          {questions.map((q, i) => (
            <QuestionReview
              key={q.question}
              question={q}
              userAnswer={answers[i]}
              index={i}
            />
          ))}
        </div>
        <div className={styles.footer}>
          <button onClick={handlePlayAgain} className={styles.homeButton}>
            🏠 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;