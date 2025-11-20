"use client";

import { useState } from "react";
import { quizQuestions } from "./quizData";
import QuizQuestion from "./quizQuestions";
import QuizScore from "./quizScore";

export default function QuizBoard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];

  const handleAnswer = (selected: string) => {
    if (selected === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < quizQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="bg-white shadow rounded p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Programming Quiz</h2>

      {!isFinished ? (
        <QuizQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          index={currentIndex + 1}
          total={quizQuestions.length}
        />
      ) : (
        <QuizScore score={score} total={quizQuestions.length} onRestart={handleRestart} />
      )}
    </div>
  );
}
