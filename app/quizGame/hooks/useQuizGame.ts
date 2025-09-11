// app/quiz/hooks/useQuizGame.ts
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questionsByLanguage } from "../data/questions";
import { TOTAL_ROUNDS, COUNTDOWN_TIME, DIFFICULTY_POINTS } from "../constants/game";

export const useQuizGame = () => {
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
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [weaponUsed, setWeaponUsed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const questions = selectedLanguage ? questionsByLanguage[selectedLanguage] : [];
  const currentQuestion = questions[currentRound % questions.length];

  useEffect(() => {
    const lang = localStorage.getItem("selectedLanguage");
    if (!lang || !questionsByLanguage[lang]) {
      router.push("/dashboard");
    } else {
      setSelectedLanguage(lang);
    }
  }, [router]);

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

  const handleConfirm = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    const correct = selectedAnswer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      let points = DIFFICULTY_POINTS[currentQuestion.difficulty as keyof typeof DIFFICULTY_POINTS];
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
  }, [selectedAnswer, currentQuestion, selectedWeapon, weaponUsed, maxStreak]);

  const handleTimeUp = useCallback(() => {
    setIsAnswerConfirmed(true);
    setIsCorrect(false);
    setStreak(0);
  }, []);

  const handleNext = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
      setIsCorrect(null);
      setTimeLeft(
        selectedWeapon === "extra-time" && !weaponUsed
          ? COUNTDOWN_TIME + 10
          : COUNTDOWN_TIME
      );
      setShowExplanation(false);
      if (selectedWeapon === "extra-time" && !weaponUsed) {
        setWeaponUsed(true);
      }
    } else {
      setShowSummary(true);
    }
  }, [currentRound, selectedWeapon, weaponUsed]);

  const handleCloseGame = useCallback(() => {
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setMaxStreak(0);
    setGameOver(true);
    setShowSummary(true);
  }, []);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const getDifficultyColor = useCallback((difficulty: string) => {
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
  }, []);

  const getProgressPercentage = useCallback(() => {
    return ((currentRound + 1) / TOTAL_ROUNDS) * 100;
  }, [currentRound]);

  return {
    selectedLanguage,
    currentRound,
    selectedAnswer,
    isAnswerConfirmed,
    isCorrect,
    score,
    timeLeft,
    showSummary,
    streak,
    maxStreak,
    correctAnswers,
    showExplanation,
    gameStarted,
    selectedWeapon,
    weaponUsed,
    gameOver,
    currentQuestion,
    questions,
    setSelectedAnswer,
    setShowExplanation,
    handleConfirm,
    handleNext,
    handleCloseGame,
    startGame,
    setSelectedWeapon,
    getDifficultyColor,
    getProgressPercentage,
  };
};