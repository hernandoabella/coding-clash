// app/quiz/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaTrophy,
  FaClock,
  FaStar,
  FaCheck,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";

import { questionsByLanguage } from "./data/questions";
import { TOTAL_ROUNDS, COUNTDOWN_TIME, DIFFICULTY_POINTS } from "./constants/game";

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

  // Weapon state
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [weaponUsed, setWeaponUsed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Load language from localStorage
  useEffect(() => {
    const lang = localStorage.getItem("selectedLanguage");
    if (!lang || !questionsByLanguage[lang]) {
      router.push("/dashboard");
    } else {
      setSelectedLanguage(lang);
    }
  }, [router]);

  const selectedDifficulty =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedDifficulty")?.toLowerCase()
      : null;

  const questions = selectedLanguage
    ? questionsByLanguage[selectedLanguage].filter(
        (q) => q.difficulty.toLowerCase() === selectedDifficulty
      )
    : [];

  const currentQuestion = questions[currentRound % questions.length];

  // Reset timer at the start of each round
  useEffect(() => {
    if (!gameStarted || showSummary) return;

    setTimeLeft(
      selectedWeapon === "extra-time" && !weaponUsed
        ? COUNTDOWN_TIME + 10
        : COUNTDOWN_TIME
    );
  }, [currentRound, gameStarted, showSummary]);

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || isAnswerConfirmed || showSummary) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, isAnswerConfirmed, showSummary, currentRound]);

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentQuestion?.answer;
    setIsCorrect(correct);

    if (correct) {
      let points = DIFFICULTY_POINTS[currentQuestion.difficulty];
      if (selectedWeapon === "double-points" && !weaponUsed) {
        points *= 2;
        setWeaponUsed(true);
      }
      setScore((prev) => prev + points);
      setCorrectAnswers((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
    } else {
      if (selectedWeapon === "shield" && !weaponUsed) {
        setWeaponUsed(true);
      } else {
        setStreak(0);
      }
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
      setShowExplanation(false);

      if (selectedWeapon === "extra-time" && !weaponUsed) {
        setWeaponUsed(true);
      }
    } else {
      setShowSummary(true);
    }
  };

  const handleCloseGame = () => {
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setMaxStreak(0);
    setGameOver(true);
    setShowSummary(true);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressPercentage = () => ((currentRound + 1) / TOTAL_ROUNDS) * 100;

  if (!selectedLanguage) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              Round {currentRound + 1}/{TOTAL_ROUNDS}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                currentQuestion.difficulty
              )}`}
            >
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

            <button
              onClick={handleCloseGame}
              className="text-red-600 text-sm font-semibold hover:underline"
            >
              ✖
            </button>
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
            const isRight =
              isAnswerConfirmed && option === currentQuestion.answer;
            const isWrong = isAnswerConfirmed && isSelected && !isRight;

            return (
              <motion.button
                key={index}
                onClick={() =>
                  !isAnswerConfirmed && setSelectedAnswer(option)
                }
                className={`w-full px-4 py-3 rounded-lg text-left border transition-all
                  ${isRight
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
              {currentRound < TOTAL_ROUNDS - 1
                ? "Next Question"
                : "See Results"}
            </motion.button>
          )}

          {isAnswerConfirmed && (
            <div
              className={`flex items-center gap-2 text-lg font-semibold ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {gameOver ? "Game Over!" : "Quiz Completed!"}
              </h2>
              <p className="text-gray-600 mb-6">
                {gameOver
                  ? "You closed the game early and lost all points."
                  : `You've finished the ${selectedLanguage} quiz`}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-blue-800">Total Score</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswers}/{TOTAL_ROUNDS}
                  </div>
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
                  <FaHome /> Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaSyncAlt /> Play Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
