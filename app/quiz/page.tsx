// app/quiz/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaTrophy, FaClock, FaStar, FaCheck, FaTimes, FaCrown } from "react-icons/fa";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  explanation?: string;
};

const questionsByLanguage: Record<string, Question[]> = {
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
      difficulty: "easy",
      category: "HTML Basics",
      explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
    },
    {
      id: 2,
      question: "Which tag is used to create a hyperlink in HTML?",
      options: ["<a>", "<link>", "<href>", "<url>"],
      answer: "<a>",
      difficulty: "easy",
      category: "HTML Tags",
      explanation: "The <a> tag defines a hyperlink, which is used to link from one page to another."
    },
    {
      id: 3,
      question: "Which attribute is used to define inline styles in HTML?",
      options: ["class", "styles", "style", "font"],
      answer: "style",
      difficulty: "medium",
      category: "HTML Attributes",
      explanation: "The style attribute is used to add inline CSS styles to an HTML element."
    },
    {
      id: 4,
      question: "Which HTML element is used for the largest heading?",
      options: ["<h6>", "<heading>", "<h1>", "<head>"],
      answer: "<h1>",
      difficulty: "easy",
      category: "HTML Tags",
      explanation: "The <h1> element represents the highest level heading, while <h6> represents the lowest."
    },
  ],
  JavaScript: [
    {
      id: 1,
      question: "What keyword is used to declare a constant in JavaScript?",
      options: ["var", "const", "let", "define"],
      answer: "const",
      difficulty: "easy",
      category: "JavaScript Variables",
      explanation: "The const keyword is used to declare constants - variables that cannot be reassigned."
    },
    {
      id: 2,
      question: "What will `typeof null` return in JavaScript?",
      options: ["object", "null", "undefined", "number"],
      answer: "object",
      difficulty: "medium",
      category: "JavaScript Types",
      explanation: "This is a known quirk in JavaScript - typeof null returns 'object' due to historical reasons."
    },
    {
      id: 3,
      question: "Which method adds one or more elements to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      answer: "push()",
      difficulty: "easy",
      category: "JavaScript Arrays",
      explanation: "The push() method adds elements to the end of an array and returns the new length."
    },
    {
      id: 4,
      question: "What does the '=== operator' do in JavaScript?",
      options: [
        "Assigns a value",
        "Compares value and type",
        "Compares only value",
        "Checks for inequality"
      ],
      answer: "Compares value and type",
      difficulty: "medium",
      category: "JavaScript Operators",
      explanation: "The === operator performs strict equality comparison, checking both value and data type."
    },
  ],
  Python: [
    {
      id: 1,
      question: "What is the output of `print(2 ** 3)` in Python?",
      options: ["6", "8", "9", "Error"],
      answer: "8",
      difficulty: "easy",
      category: "Python Operators",
      explanation: "The ** operator is used for exponentiation in Python, so 2 ** 3 means 2 raised to the power of 3."
    },
    {
      id: 2,
      question: "Which keyword is used for function definition in Python?",
      options: ["func", "def", "function", "define"],
      answer: "def",
      difficulty: "easy",
      category: "Python Functions",
      explanation: "In Python, the 'def' keyword is used to define a function."
    },
    {
      id: 3,
      question: "How do you create a comment in Python?",
      options: ["// Comment", "/* Comment */", "# Comment", "-- Comment"],
      answer: "# Comment",
      difficulty: "easy",
      category: "Python Syntax",
      explanation: "Python uses the # symbol for single-line comments."
    },
    {
      id: 4,
      question: "Which collection is ordered and changeable in Python?",
      options: ["Set", "Dictionary", "List", "Tuple"],
      answer: "List",
      difficulty: "medium",
      category: "Python Data Structures",
      explanation: "Lists are ordered, mutable sequences in Python. Tuples are ordered but immutable."
    },
  ],
  CSS: [
    {
      id: 1,
      question: "Which property is used to change the text color?",
      options: ["text-color", "font-color", "color", "text-style"],
      answer: "color",
      difficulty: "easy",
      category: "CSS Properties",
      explanation: "The 'color' property is used to set the color of text in CSS."
    },
    {
      id: 2,
      question: "How do you select an element with id 'header' in CSS?",
      options: [".header", "#header", "*header", "header"],
      answer: "#header",
      difficulty: "easy",
      category: "CSS Selectors",
      explanation: "The # symbol is used to select elements by their id attribute in CSS."
    },
    {
      id: 3,
      question: "Which property is used to create space between elements?",
      options: ["spacing", "margin", "padding", "gap"],
      answer: "margin",
      difficulty: "medium",
      category: "CSS Layout",
      explanation: "Margin creates space outside an element's border, while padding creates space inside."
    },
    {
      id: 4,
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      answer: "Cascading Style Sheets",
      difficulty: "easy",
      category: "CSS Basics",
      explanation: "CSS stands for Cascading Style Sheets, which is used to style web pages."
    },
  ],
};

const TOTAL_ROUNDS = 10;
const COUNTDOWN_TIME = 20;
const DIFFICULTY_POINTS = {
  easy: 5,
  medium: 10,
  hard: 15
};

export default function QuizPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);
  const [showSummary, setShowSummary] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("selectedLanguage");
    if (!lang || !questionsByLanguage[lang]) {
      router.push("/dashboard");
    } else {
      setSelectedLanguage(lang);
    }
  }, [router]);

  const questions = selectedLanguage ? questionsByLanguage[selectedLanguage] : [];
  const currentQuestion = questions[currentRound % questions.length];

  useEffect(() => {
    if (!gameStarted || isAnswerConfirmed || showSummary) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleTimeUp();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound, isAnswerConfirmed, showSummary, gameStarted]);

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentQuestion?.answer;
    setIsCorrect(correct);
    
    if (correct) {
      const points = DIFFICULTY_POINTS[currentQuestion.difficulty];
      setScore((prev) => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    
    setIsAnswerConfirmed(true);
  };

  const handleTimeUp = () => {
    setIsAnswerConfirmed(true);
    setIsCorrect(false);
    setStreak(0);
  };

  const handleNext = () => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
      setIsCorrect(null);
      setTimeLeft(COUNTDOWN_TIME);
      setShowExplanation(false);
    } else {
      setShowSummary(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressPercentage = () => {
    return ((currentRound + 1) / TOTAL_ROUNDS) * 100;
  };

  if (!selectedLanguage) return null;

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCrown className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedLanguage} Quiz</h1>
            <p className="text-gray-600 mb-6">Test your {selectedLanguage} knowledge with {TOTAL_ROUNDS} challenging questions!</p>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold text-gray-700 mb-2">Game Rules:</h2>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• {TOTAL_ROUNDS} questions with increasing difficulty</li>
                <li>• {COUNTDOWN_TIME} seconds per question</li>
                <li>• Points: Easy ({DIFFICULTY_POINTS.easy}), Medium ({DIFFICULTY_POINTS.medium}), Hard ({DIFFICULTY_POINTS.hard})</li>
                <li>• Answer streaks earn bonus points!</li>
              </ul>
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Start Quiz
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
        {/* Header with progress and stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              Round {currentRound + 1}/{TOTAL_ROUNDS}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-yellow-600">
              <FaStar />
              <span className="font-semibold">{score}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <FaTrophy />
                <span className="font-semibold">x{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <FaClock />
              <span className="font-mono text-sm">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {currentQuestion?.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isRight = isAnswerConfirmed && option === currentQuestion.answer;
            const isWrong = isAnswerConfirmed && isSelected && !isRight;

            return (
              <motion.button
                key={index}
                onClick={() => !isAnswerConfirmed && setSelectedAnswer(option)}
                className={`w-full px-4 py-3 rounded-lg text-left border transition-all
                  ${
                    isRight
                      ? "bg-green-100 border-green-500 text-green-700"
                      : isWrong
                      ? "bg-red-100 border-red-500 text-red-700"
                      : isSelected
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                disabled={isAnswerConfirmed}
                whileHover={{ scale: isAnswerConfirmed ? 1 : 1.02 }}
                whileTap={{ scale: isAnswerConfirmed ? 1 : 0.98 }}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerConfirmed && currentQuestion.explanation && !showExplanation && (
          <button 
            onClick={() => setShowExplanation(true)}
            className="w-full text-center text-blue-600 hover:text-blue-800 mb-4"
          >
            View Explanation
          </button>
        )}
        
        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200"
          >
            <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
            <p className="text-blue-700">{currentQuestion.explanation}</p>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          {!isAnswerConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Answer
            </button>
          ) : (
            <motion.button
              onClick={handleNext}
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentRound < TOTAL_ROUNDS - 1 ? "Next Question" : "See Results"}
            </motion.button>
          )}
          
          {isAnswerConfirmed && (
            <div className={`flex items-center gap-2 text-lg font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? (
                <>
                  <FaCheck /> +{DIFFICULTY_POINTS[currentQuestion.difficulty]} points
                </>
              ) : (
                <>
                  <FaTimes /> Incorrect
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600 mb-6">You've finished the {selectedLanguage} quiz</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-blue-800">Total Score</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{correctAnswers}/{TOTAL_ROUNDS}</div>
                  <div className="text-sm text-green-800">Correct Answers</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{maxStreak}</div>
                  <div className="text-sm text-yellow-800">Best Streak</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((correctAnswers / TOTAL_ROUNDS) * 100)}%
                  </div>
                  <div className="text-sm text-purple-800">Accuracy</div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  <FaHome /> Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}