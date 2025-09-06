"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCode } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const Quiz = () => {
  const languages = ["HTML", "JavaScript", "Python"];
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [open, setOpen] = useState(true); // toggle visibility
  const router = useRouter();

  const handleStart = () => {
    if (selectedLanguage) {
      localStorage.setItem("selectedLanguage", selectedLanguage);
      router.push("/quiz");
    }
  };

  if (!open) return null; // hide if closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="relative w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <FaCode className="text-5xl text-blue-600 mb-4 animate-pulse" />
          <h1 className="text-3xl font-extrabold mb-2">Coding Clash</h1>
          <p className="text-md text-gray-600">
            Choose your language weapon to begin the battle!
          </p>
        </div>

        {/* Select box */}
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select your preferred language:
        </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Your Weapon --</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Start button */}
        <button
          disabled={!selectedLanguage}
          onClick={handleStart}
          className={`w-full py-3 rounded-lg text-lg font-semibold transition-all ${
            selectedLanguage
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Quiz;
