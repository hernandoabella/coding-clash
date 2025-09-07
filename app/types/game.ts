// types/game.ts
export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSession {
  id: string;
  userId: string;
  language: string;
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completed: boolean;
  timeSpent: number; // in seconds
  xpEarned: number;
  startTime: Date;
  endTime?: Date;
  status: "active" | "completed" | "abandoned";
}

export interface Question {
  id: string;
  language: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category: string;
  createdAt: Date;
}

export interface UserAnswer {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  answeredAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  unlockedAt: Date;
  progress?: number;
}