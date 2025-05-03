"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const allQuestions: Record<string, Question[]> = {
  javascript: [
    {
      question: 'What is the output of "2" + 2 in JavaScript?',
      options: ['4', '"4"', '"22"', 'NaN'],
      answer: '"22"',
    },
    {
      question: 'Which keyword declares a variable?',
      options: ['var', 'int', 'define', 'dim'],
      answer: 'var',
    },
    {
      question: 'What does === mean in JavaScript?',
      options: ['Equals', 'Strict equals', 'Assignment', 'Not equals'],
      answer: 'Strict equals',
    },
    {
      question: 'What is a closure?',
      options: [
        'A function inside another function',
        'A loop',
        'A block',
        'A CSS property',
      ],
      answer: 'A function inside another function',
    },
  ],
  // Similar structure for Python and C++
};

const TOTAL_ROUNDS = 5;
const COUNTDOWN_TIME = 20;

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

  useEffect(() => {
    const lang = localStorage.getItem("selectedLanguage");
    if (!lang || !allQuestions[lang.toLowerCase()]) {
      router.push("/");
    } else {
      setSelectedLanguage(lang.toLowerCase());
    }
  }, [router]);

  const questions = selectedLanguage ? allQuestions[selectedLanguage] : [];
  const currentQuestion =
    questions.length > 0 ? questions[currentRound % questions.length] : null;

  useEffect(() => {
    if (isAnswerConfirmed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleNext();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound, isAnswerConfirmed]);

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentQuestion?.answer;
    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + 5); // +5 puntos de experiencia
    setIsAnswerConfirmed(true);
  };

  const handleNext = () => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
      setIsCorrect(null);
      setTimeLeft(COUNTDOWN_TIME);
    } else {
      setShowSummary(true); // Muestra resumen al final
    }
  };

  if (!selectedLanguage || !currentQuestion) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-4">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <span className="font-semibold">
            Round {currentRound + 1}/{TOTAL_ROUNDS}
          </span>
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-mono text-xs">
            ⏱ {timeLeft}s
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isRight = isAnswerConfirmed && option === currentQuestion.answer;
            const isWrong = isAnswerConfirmed && isSelected && !isRight;

            return (
              <button
                key={index}
                onClick={() => !isAnswerConfirmed && setSelectedAnswer(option)}
                className={`text-black w-full px-4 py-3 rounded-lg text-left border transition-all
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
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswerConfirmed && (
          <div
            className={`mt-5 font-medium text-center text-lg ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "✅ Correct!" : `❌ Incorrect. Answer: ${currentQuestion?.answer}`}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!isAnswerConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="text-black bg-blue-600 px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-green-600  px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Resumen Final */}
      {showSummary && (
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center text-black">
            <motion.h2
              className="text-2xl font-bold mb-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              🎉 Quiz Completed!
            </motion.h2>
            <motion.p
              className="text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Total XP {""}
              <span className="text-blue-600 font-bold">+{score}</span>
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
            >
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Go Back Home
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
