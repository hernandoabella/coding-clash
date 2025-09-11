import { Question } from "../types";

export const questionsByLanguage: Record<string, Question[]> = {
  JavaScript: [
    {
      id: 1,
      question: "What keyword is used to declare a constant in JavaScript?",
      options: ["var", "const", "let", "define"],
      answer: "const",
      difficulty: "easy",
      category: "JavaScript Variables",
      explanation:
        "The const keyword is used to declare constants - variables that cannot be reassigned.",
    },
    {
      id: 2,
      question: "What will `typeof null` return in JavaScript?",
      options: ["object", "null", "undefined", "number"],
      answer: "object",
      difficulty: "medium",
      category: "JavaScript Types",
      explanation:
        "This is a known quirk in JavaScript - typeof null returns 'object' due to historical reasons.",
    },
    {
      id: 3,
      question: "Which method adds one or more elements to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()",
      difficulty: "easy",
      category: "JavaScript Arrays",
      explanation:
        "The push() method adds elements to the end of an array and returns the new length.",
    },
    {
      id: 4,
      question: "What does the '=== operator' do in JavaScript?",
      options: [
        "Assigns a value",
        "Compares value and type",
        "Compares only value",
        "Checks for inequality",
      ],
      answer: "Compares value and type",
      difficulty: "medium",
      category: "JavaScript Operators",
      explanation:
        "The === operator performs strict equality comparison, checking both value and data type.",
    },
  ],
};