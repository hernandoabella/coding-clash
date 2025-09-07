"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCode, FaTimes, FaStar, FaCrown, FaFire } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface QuizProps {
  onGameStart?: (sessionId: string) => void;
}

const Quiz = ({ onGameStart }: QuizProps) => {
  const languages = ["HTML", "JavaScript", "Python", "CSS"];
  const difficulties = [
    { level: "Easy", description: "Great for beginners", icon: <FaStar className="text-green-500" />, points: 5 },
    { level: "Medium", description: "A good challenge", icon: <FaStar className="text-yellow-500" />, points: 10 },
    { level: "Hard", description: "For coding experts", icon: <FaCrown className="text-red-500" />, points: 15 },
  ];
  
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleStart = async () => {
    if (!selectedLanguage || !selectedDifficulty) return;
    
    setIsLoading(true);
    setError("");

    try {
      // Create a new game session using your /api/game/start endpoint
      const response = await fetch('/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          difficulty: selectedDifficulty,
          weapon: null, // You can add weapon selection later
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start game session');
      }

      // Store session ID and game details
      localStorage.setItem("selectedLanguage", selectedLanguage);
      localStorage.setItem("selectedDifficulty", selectedDifficulty);
      localStorage.setItem("gameSessionId", data.sessionId);

      // Callback to parent component if provided
      if (onGameStart) {
        onGameStart(data.sessionId);
      }

      // Redirect to quiz page
      router.push("/quiz");

    } catch (error: any) {
      console.error('Error starting game:', error);
      setError(error.message || 'Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    
    // Optional: Track abandoned attempt for analytics
    if (selectedLanguage && selectedDifficulty && session?.user?.id) {
      // You might want to create an API for tracking abandoned sessions
      fetch('/api/game/abandon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          difficulty: selectedDifficulty,
        }),
      }).catch(console.error); // Silent fail for analytics
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="relative w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          disabled={isLoading}
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FaCode className="text-5xl text-blue-600 animate-pulse" />
              <FaFire className="absolute -top-2 -right-2 text-orange-500 text-xl" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Coding Clash
          </h1>
          <p className="text-md text-gray-600">
            Choose your language and difficulty to begin the battle!
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Language Selection */}
        <div className="mb-6">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Select Programming Language:
          </label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            disabled={isLoading}
          >
            <option value="">-- Select Your Weapon --</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Difficulty Level:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((diff) => (
              <button
                key={diff.level}
                onClick={() => setSelectedDifficulty(diff.level)}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                  selectedDifficulty === diff.level
                    ? diff.level === "Easy"
                      ? "border-green-500 bg-green-50"
                      : diff.level === "Medium"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="mb-1">
                  {diff.icon}
                </div>
                <span className="font-medium text-sm">{diff.level}</span>
                <span className="text-xs text-gray-500 mt-1">{diff.points} pts/Q</span>
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {selectedDifficulty && difficulties.find(d => d.level === selectedDifficulty)?.description}
          </div>
        </div>

        {/* Start button */}
        <button
          disabled={!selectedLanguage || !selectedDifficulty || isLoading}
          onClick={handleStart}
          className={`w-full py-3 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedLanguage && selectedDifficulty && !isLoading
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Starting...
            </>
          ) : (
            <>
              <FaFire className="text-orange-200" />
              Start Battle
              <FaFire className="text-orange-200" />
            </>
          )}
        </button>

        {/* XP information */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Earn more XP with higher difficulty levels!
        </div>

        {/* User status info */}
        {status === 'unauthenticated' && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-xs text-yellow-700">
              Sign in to save your progress and compete on leaderboards!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;