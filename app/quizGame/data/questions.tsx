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
    {
      id: 5,
      question: "Which method can be used to flatten nested arrays in JavaScript?",
      options: ["flat()", "flatten()", "reduce()", "concat()"],
      answer: "flat()",
      difficulty: "hard",
      category: "JavaScript Arrays",
      explanation:
        "The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.",
    },
    {
      id: 6,
      question: "What is a closure in JavaScript?",
      options: [
        "A function that calls itself",
        "A function bundled with its lexical scope",
        "An object property",
        "A loop structure",
      ],
      answer: "A function bundled with its lexical scope",
      difficulty: "hard",
      category: "JavaScript Functions",
      explanation:
        "A closure is a function that remembers the variables from the place where it was defined, even if it is executed elsewhere.",
    },
    {
      id: 7,
      question: "Which of these is true about the 'this' keyword in JavaScript?",
      options: [
        "It always refers to the global object",
        "It refers to the function's scope",
        "It refers to the object that called the function",
        "It refers to the previous variable",
      ],
      answer: "It refers to the object that called the function",
      difficulty: "hard",
      category: "JavaScript Context",
      explanation:
        "In JavaScript, 'this' refers to the object that invokes the current function, not necessarily where it was defined.",
    },
    {
      id: 8,
      question: "What will the following code output? `console.log([...'abc'].map(c => c.toUpperCase()));`",
      options: [
        "[\"A\", \"B\", \"C\"]",
        "[\"a\", \"b\", \"c\"]",
        "[\"ABC\"]",
        "Error",
      ],
      answer: "[\"A\", \"B\", \"C\"]",
      difficulty: "hard",
      category: "JavaScript ES6",
      explanation:
        "The spread operator splits the string into individual characters, and map converts each character to uppercase, producing ['A', 'B', 'C'].",
    },
  ],
};
