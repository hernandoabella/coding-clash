// app/quiz/components/QuestionCard.tsx
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
  category: string;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  isAnswerConfirmed: boolean;
  isCorrect: boolean | null;
  showExplanation: boolean;
  onSelectAnswer: (answer: string) => void;
  onConfirm: () => void;
  onNext: () => void;
  onShowExplanation: () => void;
  difficultyPoints: { [key: string]: number };
}

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswerConfirmed,
  isCorrect,
  showExplanation,
  onSelectAnswer,
  onConfirm,
  onNext,
  onShowExplanation,
  difficultyPoints,
}: QuestionCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {question?.question}
      </h2>

      <div className="space-y-3 mb-6">
        {question?.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isRight = isAnswerConfirmed && option === question.answer;
          const isWrong = isAnswerConfirmed && isSelected && !isRight;

          return (
            <motion.button
              key={index}
              onClick={() => !isAnswerConfirmed && onSelectAnswer(option)}
              className={`w-full px-4 py-3 rounded-lg text-left border transition-all ${
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

      {isAnswerConfirmed && question.explanation && !showExplanation && (
        <button
          onClick={onShowExplanation}
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
          <p className="text-blue-700">{question.explanation}</p>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        {!isAnswerConfirmed ? (
          <button
            onClick={onConfirm}
            disabled={selectedAnswer === null}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Answer
          </button>
        ) : (
          <motion.button
            onClick={onNext}
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Question
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
                <FaCheck /> +{difficultyPoints[question.difficulty]} points
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
  );
}