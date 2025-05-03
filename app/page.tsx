"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCode } from "react-icons/fa";

const languages = ["HTML", "JavaScript", "Python"];

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (selectedLanguage) {
      localStorage.setItem("selectedLanguage", selectedLanguage);
      router.push("/quiz");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white text-gray-800 px-4">
      <div className="text-center mb-10">
        <FaCode className="text-5xl text-blue-600 mb-4 animate-pulse" />
        <h1 className="text-4xl font-extrabold mb-2">Coding Clash</h1>
        <p className="text-lg text-gray-600">Choose your language weapon to begin the battle!</p>
      </div>

      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl">
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
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
    </main>
  );
}
