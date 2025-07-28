import React, { createContext, useReducer, useContext } from 'react';

const QuizContext = createContext();

const initialState = {
  questions: [],
  userEmail: '',
  currentQuestionIndex: 0,
  userAnswers: Array(15).fill(null),
  visitedQuestions: Array(15).fill(false),
  status: 'start', // 'start', 'loading', 'active', 'finished'
  timeRemaining: 30 * 60, // 30 minutes in seconds
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState, // Reset state completely for a new quiz attempt
        userEmail: action.payload,
        status: 'loading',
      };
    case 'DATA_RECEIVED':
      const initialVisited = Array(15).fill(false);
      initialVisited[0] = true;
      return {
        ...state,
        questions: action.payload,
        status: 'active',
        visitedQuestions: initialVisited,
      };
    case 'DATA_FAILED':
      return { ...state, status: 'error' };
    case 'NAVIGATE_QUESTION':
      const newVisitedNav = [...state.visitedQuestions];
      newVisitedNav[action.payload] = true;
      return {
        ...state,
        currentQuestionIndex: action.payload,
        visitedQuestions: newVisitedNav,
      };
    case 'ANSWER_QUESTION':
      const newAnswers = [...state.userAnswers];
      newAnswers[state.currentQuestionIndex] = action.payload;
      return {
        ...state,
        userAnswers: newAnswers,
      };
    case 'NEXT_QUESTION': {
       const nextIndex = state.currentQuestionIndex + 1;
       if (nextIndex >= state.questions.length) return state;
       const newVisited = [...state.visitedQuestions];
       newVisited[nextIndex] = true;
       return {
           ...state,
           currentQuestionIndex: nextIndex,
           visitedQuestions: newVisited,
       };
    }
    case 'PREV_QUESTION': {
        const prevIndex = state.currentQuestionIndex - 1;
        if (prevIndex < 0) return state;
        const newVisited = [...state.visitedQuestions];
        newVisited[prevIndex] = true;
        return {
            ...state,
            currentQuestionIndex: prevIndex,
            visitedQuestions: newVisited,
        };
    }
    case 'TICK':
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
        status: state.timeRemaining === 1 ? 'finished' : state.status,
      };
    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' };
    default:
      throw new Error('Unknown action');
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <QuizContext.Provider value={{ ...state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
