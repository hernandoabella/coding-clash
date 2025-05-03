type Question = {
    question: string;
    options: string[];
  };
  
  type Props = {
    question: Question;
    selected: string | null;
    onSelect: (option: string) => void;
  };
  
  export default function QuizCard({ question, selected, onSelect }: Props) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {question.question}
        </h2>
        <div className="space-y-3">
          {question.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-4 py-2 rounded-lg border transition-all duration-200
                ${
                  selected === option
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-800 border-gray-300 hover:bg-blue-50"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }
  