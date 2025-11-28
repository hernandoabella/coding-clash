export interface Game {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const mockGames: Game[] = [
  {
    id: "quiz",
    name: "Programming Quiz",
    description: "Test your knowledge with fun programming questions.",
    icon: "📝",
  },
  {
    id: "bugFix",
    name: "Bug Fixer",
    description: "Find and fix errors in code before time runs out.",
    icon: "🐞",
  },
  {
    id: "challengeSolver",
    name: "Code Challenges",
    description: "Solve coding puzzles and show off your skills.",
    icon: "💻",
  },
];
