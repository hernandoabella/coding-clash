"use client";

interface QuizScoreProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export default function QuizScore({ score, total, onRestart }: QuizScoreProps) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4">Quiz Finished!</h3>
      <p className="text-lg mb-6">
        You scored {score} out of {total}
      </p>
      <button
        onClick={onRestart}
        className="py-2 px-6 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Play Again
      </button>
    </div>
  );
}
