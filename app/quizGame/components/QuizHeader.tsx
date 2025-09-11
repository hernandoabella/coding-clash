// app/quiz/components/QuizHeader.tsx
import { FaHome, FaTrophy, FaClock, FaStar } from "react-icons/fa";

interface QuizHeaderProps {
  currentRound: number;
  totalRounds: number;
  difficulty: string;
  score: number;
  streak: number;
  timeLeft: number;
  onCloseGame: () => void;
  getDifficultyColor: (difficulty: string) => string;
  getProgressPercentage: () => number;
}

export default function QuizHeader({
  currentRound,
  totalRounds,
  difficulty,
  score,
  streak,
  timeLeft,
  onCloseGame,
  getDifficultyColor,
  getProgressPercentage,
}: QuizHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">
            Round {currentRound + 1}/{totalRounds}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onCloseGame}
            className="text-red-600 text-sm font-semibold hover:underline"
          >
            Close ✖
          </button>
          
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
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            timeLeft <= 5 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          }`}>
            <FaClock />
            <span className="font-mono text-sm">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
    </>
  );
}