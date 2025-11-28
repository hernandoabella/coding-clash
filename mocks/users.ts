export interface RecentGame {
  id: string;
  name: string;
  score: number;
}

export interface User {
  name: ReactNode;
  username: string;
  email: string;
  level: number;
  points: number;
  recentGames: RecentGame[];
}

export const mockUser: User = {
  username: "CodeMaster",
  email: "codemaster@example.com",
  level: 5,
  points: 1200,
  recentGames: [
    { id: "quiz", name: "Programming Quiz", score: 80 },
    { id: "bugFix", name: "Bug Fixer", score: 65 },
    { id: "challengeSolver", name: "Code Challenges", score: 90 },
  ],
};
