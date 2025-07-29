import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state || {};

  if (!questions || !answers) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⚠️ No quiz data available.</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  const getScore = () => {
    return questions.reduce((score, q, i) => {
      return score + (answers[i] === q.correct_answer ? 1 : 0);
    }, 0);
  };

  const total = questions.length;
  const score = getScore();

  return (
    <div className="report-page" style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h2>📋 Quiz Report</h2>
      <p style={{ fontSize: '1.2rem' }}>
        You scored <strong>{score}</strong> out of <strong>{total}</strong>
      </p>

      <div className="question-review" style={{ marginTop: '2rem' }}>
      {questions.map((q, i) => {
        const correct = q.correct_answer;
        const userAnswer = answers[i];
        const isUnanswered = userAnswer === null || userAnswer === undefined || userAnswer === "";

        return (
          <div key={i} className="question-block" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>
              Q{i + 1}: {decodeHTMLEntities(q.question)}
            </h4>

            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {q.all_answers.map((option, idx) => {
                const isCorrect = option === correct;
                const isSelected = userAnswer === option;

                const style = {
                  backgroundColor: isCorrect
                    ? '#d4edda'
                    : isSelected
                    ? '#f8d7da'
                    : 'transparent',
                  fontWeight: isCorrect ? 'bold' : 'normal',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                };

                return (
                  <li key={idx} style={style}>
                    {decodeHTMLEntities(option)}
                    {isCorrect && " ✅"}
                    {isSelected && !isCorrect && " ❌"}
                  </li>
                );
              })}
            </ul>

            {isUnanswered && (
              <p style={{ color: '#999', fontStyle: 'italic', marginTop: '0.5rem' }}>
                ⚠️ You did not answer this question.
              </p>
            )}
          </div>
        );
      })}
 
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={() => navigate('/')} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

export default ReportPage;
