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

  // 🧠 Logic & Algorithms
  {
    id: "algoRush",
    name: "Algorithm Rush",
    description: "Solve algorithmic problems as fast as you can.",
    icon: "⚡",
  },
  {
    id: "dataStructures",
    name: "Data Structures Arena",
    description: "Master stacks, queues, trees, and graphs.",
    icon: "🌳",
  },
  {
    id: "binaryBattle",
    name: "Binary Battle",
    description: "Convert and solve binary challenges under pressure.",
    icon: "🔢",
  },

  // ⏱ Speed & Reflex
  {
    id: "speedTyping",
    name: "Code Speed Typing",
    description: "Type code correctly at lightning speed.",
    icon: "⌨️",
  },
  {
    id: "timeAttack",
    name: "Time Attack",
    description: "Solve small problems before the timer hits zero.",
    icon: "⏱",
  },

  // 🎮 Fun Modes
  {
    id: "codeMemory",
    name: "Code Memory",
    description: "Memorize and recreate code patterns.",
    icon: "🧩",
  },
 

  // 🤝 Multiplayer style
  {
    id: "codeDuel",
    name: "Code Duel",
    description: "Challenge another player in real-time coding.",
    icon: "⚔️",
  },
  {
    id: "teamBattle",
    name: "Team Battle",
    description: "Solve problems together and beat the clock.",
    icon: "🤖",
  },

  // 💡 Creative
  {
    id: "buildFeature",
    name: "Build a Feature",
    description: "Implement a missing feature in a real app.",
    icon: "🏗️",
  },

  // 🔐 Advanced
  {
    id: "secureCode",
    name: "Secure the Code",
    description: "Find vulnerabilities and harden the application.",
    icon: "🔒",
  },
  {
    id: "refactor",
    name: "Refactor Race",
    description: "Improve messy code with best practices.",
    icon: "♻️",
  },

  // 🚀 AI / Future
  {
    id: "aiPrompt",
    name: "Prompt Master",
    description: "Write the best prompt to solve a problem with AI.",
    icon: "🤖",
  },
];
