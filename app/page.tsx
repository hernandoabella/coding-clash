"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCode, FaChevronRight, FaCrown } from "react-icons/fa";

const languages = [
  { name: "HTML", color: "from-orange-500 to-red-500" },
  { name: "JavaScript", color: "from-yellow-400 to-amber-600" },
  { name: "Python", color: "from-blue-500 to-indigo-600" }
];

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for previously selected language
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage && languages.some(lang => lang.name === savedLanguage)) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleStart = () => {
    if (selectedLanguage) {
      setIsTransitioning(true);
      localStorage.setItem("selectedLanguage", selectedLanguage);
      
      // Add a slight delay for the animation to complete
      setTimeout(() => {
        router.push("/quiz");
      }, 500);
    }
  };

  const selectedLangData = languages.find(lang => lang.name === selectedLanguage);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-blue-500/10 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              fontSize: `${Math.random() * 2 + 1}rem`
            }}
          >
            {"{}"}
          </div>
        ))}
      </div>

      <div className={`text-center mb-8 transition-transform duration-500 ${isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="relative inline-block">
          <div className="absolute -inset-2 bg-blue-600/30 blur-lg rounded-full"></div>
          <FaCode className="text-6xl text-blue-400 mb-4 relative z-10" />
        </div>
        <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Coding Clash
        </h1>
        <p className="text-lg text-blue-200 max-w-md mx-auto">
          Select your programming language and test your skills in this epic coding battle!
        </p>
      </div>

      <div className={`w-full max-w-md bg-slate-800/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-500 ${isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex items-center justify-between mb-6">
          <label htmlFor="language" className="block text-sm font-medium text-blue-200">
            Choose Your Weapon:
          </label>
          {selectedLanguage && (
            <div className="flex items-center text-amber-400">
              <FaCrown className="mr-1" />
              <span className="text-xs font-semibold">Expert Mode</span>
            </div>
          )}
        </div>
        
        <div className="relative mb-8">
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">-- Select Your Weapon --</option>
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FaChevronRight className="text-slate-400 transform rotate-90" />
          </div>
        </div>

        {selectedLanguage && (
          <div className="mb-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600/50">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 bg-gradient-to-r ${selectedLangData?.color}`}></div>
              <span className="font-medium">Selected: </span>
              <span className="ml-2 font-semibold">{selectedLanguage}</span>
            </div>
          </div>
        )}

        <button
          disabled={!selectedLanguage}
          onClick={handleStart}
          className={`w-full py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center ${
            selectedLanguage
              ? `bg-gradient-to-r ${selectedLangData?.color} text-white hover:shadow-lg hover:scale-[1.02] transform transition-all duration-300 shadow-blue-900/30`
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          {selectedLanguage ? (
            <>
              Start Battle <FaChevronRight className="ml-2" />
            </>
          ) : (
            "Select a Language"
          )}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Your progress will be saved automatically
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center text-slate-500 text-sm">
        <p>Are you ready for the challenge?</p>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-20px) rotate(10deg); opacity: 0; }
        }
        .animate-float {
          animation: float 8s infinite linear;
        }
      `}</style>
    </main>
  );
}