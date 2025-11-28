export interface QuizQuestionType {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const quizQuestions: QuizQuestionType[] = [
  {
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "static"],
    correctAnswer: "const",
  },
  {
    question: "What is the output of `typeof NaN` in JavaScript?",
    options: ["number", "NaN", "undefined", "object"],
    correctAnswer: "number",
  },
  {
    question: "Which of these is NOT a primitive type in JavaScript?",
    options: ["string", "number", "object", "boolean"],
    correctAnswer: "object",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Syntax",
      "Custom Style Scripts",
    ],
    correctAnswer: "Cascading Style Sheets",
  },
];
