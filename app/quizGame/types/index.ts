// types/index.ts
import { ReactNode } from "react";

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  explanation?: string;
}

export interface Weapon {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
}

export type GameState = 'weapon-selection' | 'playing' | 'finished' | 'loading' | 'error';