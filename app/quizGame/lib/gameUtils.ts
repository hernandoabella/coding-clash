// lib/gameUtils.ts
import { DIFFICULTY_POINTS } from "../constants";

export const calculatePoints = (difficulty: string, streak: number): number => {
  const basePoints = DIFFICULTY_POINTS[difficulty as keyof typeof DIFFICULTY_POINTS] || 5;
  const streakBonus = Math.floor(streak / 3); // Bonus point for every 3-streak
  return basePoints + streakBonus;
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "text-green-600 bg-green-100";
    case "medium":
      return "text-yellow-600 bg-yellow-100";
    case "hard":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getProgressPercentage = (currentRound: number, totalRounds: number): number => {
  return ((currentRound + 1) / totalRounds) * 100;
};