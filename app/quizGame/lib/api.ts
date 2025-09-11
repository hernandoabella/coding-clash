// lib/api.ts
import { Question, GameResult } from "../types";

export const fetchQuestions = async (
  sessionId: string,
  language: string,
  difficulty: string,
  limit: number
): Promise<Question[]> => {
  const response = await fetch(
    `/api/quizGame/questions?sessionId=${sessionId}&language=${language}&difficulty=${difficulty}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  
  const data = await response.json();
  return data.questions || [];
};

export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  selectedAnswer: string,
  timeSpent: number
): Promise<GameResult> => {
  const response = await fetch('/api/quizGame/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      questionId,
      selectedAnswer,
      timeSpent,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit answer');
  }
  
  return response.json();
};

export const endGameSession = async (
  sessionId: string,
  completed: boolean,
  finalScore: number
): Promise<void> => {
  await fetch('/api/quizGame/end', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      completed,
      finalScore,
    }),
  });
};