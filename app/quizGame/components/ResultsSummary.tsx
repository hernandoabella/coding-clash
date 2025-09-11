// app/quiz/components/ResultsSummary.tsx
import { motion } from "framer-motion";
import { FaTrophy, FaHome, FaSyncAlt } from "react-icons/fa";

interface ResultsSummaryProps {
  selectedLanguage: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  maxStreak: number;
  gameOver: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

export default function ResultsSummary({
  selectedLanguage,
  score,
  correctAnswers,
  totalQuestions,
  maxStreak,
  gameOver,
  onPlayAgain,
  onExit,
}: ResultsSummaryProps) {
  return (
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
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-green-800">Correct Answers</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{maxStreak}</div>
            <div className="text-sm text-yellow-800">Best Streak</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((correctAnswers / totalQuestions) * 100)}%
            </div>
            <div className="text-sm text-purple-800">Accuracy</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onExit}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <FaHome /> Dashboard
          </button>
          <button
            onClick={onPlayAgain}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaSyncAlt /> Play Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}