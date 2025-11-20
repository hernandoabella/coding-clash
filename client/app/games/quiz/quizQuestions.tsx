"use client";

interface QuizQuestionProps {
  question: string;
  options: string[];
  onAnswer: (selected: string) => void;
  index: number;
  total: number;
}

export default function QuizQuestion({
  question,
  options,
  onAnswer,
  index,
  total,
}: QuizQuestionProps) {
  return (
    <div>
      <p className="text-gray-600 mb-4">
        Question {index} / {total}
      </p>
      <h3 className="text-xl font-semibold mb-6">{question}</h3>
      <div className="grid gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
