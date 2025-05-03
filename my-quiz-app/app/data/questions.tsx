import { Question } from "@/app/types/questions";

export const questionsByLanguage: Record<string, Question[]> = {
  HTML: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Trainer Marking Language",
        "Hyper Text Markup Language",
        "Hyper Text Marketing Language",
        "Hyper Tool Markup Language",
      ],
      answer: "Hyper Text Markup Language",
    },
    {
      id: 2,
      question: "Which tag is used to create a hyperlink in HTML?",
      options: ["<a>", "<link>", "<href>", "<url>"],
      answer: "<a>",
    },
  ],
  JavaScript: [
    {
      id: 1,
      question: "What keyword is used to declare a constant in JavaScript?",
      options: ["var", "const", "let", "define"],
      answer: "const",
    },
    {
      id: 2,
      question: "What will `typeof null` return in JavaScript?",
      options: ["object", "null", "undefined", "number"],
      answer: "object",
    },
  ],
  Python: [
    {
      id: 1,
      question: "What is the output of `print(2 ** 3)` in Python?",
      options: ["6", "8", "9", "Error"],
      answer: "8",
    },
    {
      id: 2,
      question: "Which keyword is used for function definition in Python?",
      options: ["func", "def", "function", "define"],
      answer: "def",
    },
  ],
};
