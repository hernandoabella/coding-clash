// app/achievements/page.tsx
"use client";

import { useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { FaTrophy, FaMedal, FaLock, FaCheck, FaStar, FaFilter, FaFire, FaAward } from "react-icons/fa";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: "game" | "skill" | "social" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  progress: number;
  totalRequired: number;
  earned: boolean;
  earnedDate?: string;
}

export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "game" | "skill" | "social" | "special">("all");

  const achievements: Achievement[] = [
    {
      id: 1,
      title: "First Blood",
      description: "Win your first match",
      icon: "🩸",
      category: "game",
      rarity: "common",
      points: 10,
      progress: 1,
      totalRequired: 1,
      earned: true,
      earnedDate: "2023-10-15"
    },
    {
      id: 2,
      title: "Code Master",
      description: "Answer 100 questions correctly",
      icon: "💻",
      category: "skill",
      rarity: "rare",
      points: 50,
      progress: 87,
      totalRequired: 100,
      earned: false
    },
    {
      id: 3,
      title: "Social Butterfly",
      description: "Add 10 friends",
      icon: "🦋",
      category: "social",
      rarity: "rare",
      points: 30,
      progress: 4,
      totalRequired: 10,
      earned: false
    },
    {
      id: 4,
      title: "Win Streak",
      description: "Win 5 matches in a row",
      icon: "🔥",
      category: "game",
      rarity: "epic",
      points: 75,
      progress: 3,
      totalRequired: 5,
      earned: false
    },
    {
      id: 5,
      title: "JavaScript Expert",
      description: "Master JavaScript questions with 90% accuracy",
      icon: "📜",
      category: "skill",
      rarity: "epic",
      points: 100,
      progress: 72,
      totalRequired: 90,
      earned: false
    },
    {
      id: 6,
      title: "Community Helper",
      description: "Help 5 other users in the forums",
      icon: "🤝",
      category: "social",
      rarity: "common",
      points: 25,
      progress: 2,
      totalRequired: 5,
      earned: false
    },
    {
      id: 7,
      title: "Speed Demon",
      description: "Answer 10 questions in under 5 seconds each",
      icon: "⚡",
      category: "skill",
      rarity: "epic",
      points: 85,
      progress: 7,
      totalRequired: 10,
      earned: false
    },
    {
      id: 8,
      title: "Game Champion",
      description: "Reach the top 10 on the leaderboard",
      icon: "🏆",
      category: "game",
      rarity: "legendary",
      points: 200,
      progress: 42,
      totalRequired: 10,
      earned: false
    },
    {
      id: 9,
      title: "Early Adopter",
      description: "Join during the beta testing phase",
      icon: "🚀",
      category: "special",
      rarity: "legendary",
      points: 150,
      progress: 1,
      totalRequired: 1,
      earned: true,
      earnedDate: "2023-09-01"
    },
    {
      id: 10,
      title: "Perfect Score",
      description: "Get a perfect score in any quiz",
      icon: "💯",
      category: "skill",
      rarity: "rare",
      points: 60,
      progress: 0,
      totalRequired: 1,
      earned: false
    },
    {
      id: 11,
      title: "Friendly Rivalry",
      description: "Play against a friend 10 times",
      icon: "⚔️",
      category: "social",
      rarity: "common",
      points: 20,
      progress: 6,
      totalRequired: 10,
      earned: false
    },
    {
      id: 12,
      title: "Marathon Runner",
      description: "Complete 50 quizzes",
      icon: "🏃",
      category: "game",
      rarity: "epic",
      points: 120,
      progress: 28,
      totalRequired: 50,
      earned: false
    }
  ];

  const filteredAchievements = activeFilter === "all" 
    ? achievements 
    : achievements.filter(ach => ach.category === activeFilter);

  const earnedAchievements = achievements.filter(ach => ach.earned);
  const totalPoints = earnedAchievements.reduce((sum, ach) => sum + ach.points, 0);
  const completionPercentage = Math.round((earnedAchievements.length / achievements.length) * 100);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-300 bg-gray-50";
      case "rare": return "border-blue-300 bg-blue-50";
      case "epic": return "border-purple-300 bg-purple-50";
      case "legendary": return "border-yellow-300 bg-yellow-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common": return <FaMedal className="text-gray-500" />;
      case "rare": return <FaMedal className="text-blue-500" />;
      case "epic": return <FaStar className="text-purple-500" />;
      case "legendary": return <FaAward className="text-yellow-500" />;
      default: return <FaMedal className="text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "game": return <FaTrophy className="text-orange-500" />;
      case "skill": return <FaStar className="text-blue-500" />;
      case "social": return <FaFire className="text-green-500" />;
      case "special": return <FaAward className="text-purple-500" />;
      default: return <FaTrophy className="text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaTrophy className="text-yellow-500" /> Achievements
          </h1>
          <p className="text-gray-600">Earn badges and showcase your coding skills</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
              {earnedAchievements.length}<span className="text-gray-400">/</span>{achievements.length}
            </div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{completionPercentage}% Complete</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center gap-2">
              <FaStar className="text-yellow-500" /> {totalPoints}
            </div>
            <div className="text-sm text-gray-600">Total Points Earned</div>
            <div className="mt-4 text-xs text-gray-500">Rank: Achievement Hunter</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {earnedAchievements.filter(a => a.rarity === "legendary").length}
            </div>
            <div className="text-sm text-gray-600">Legendary Achievements</div>
            <div className="mt-4 flex justify-center">
              <div className="flex gap-1">
                {getRarityIcon("legendary")}
                <span className="text-xs text-yellow-700">Legendary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Achievements
            </button>
            <button
              onClick={() => setActiveFilter("game")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeFilter === "game" 
                  ? "bg-orange-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaTrophy size={14} /> Game
            </button>
            <button
              onClick={() => setActiveFilter("skill")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeFilter === "skill" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaStar size={14} /> Skill
            </button>
            <button
              onClick={() => setActiveFilter("social")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeFilter === "social" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaFire size={14} /> Social
            </button>
            <button
              onClick={() => setActiveFilter("special")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeFilter === "special" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaAward size={14} /> Special
            </button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl shadow-lg p-5 border-2 transition-all hover:shadow-xl ${
                achievement.earned 
                  ? getRarityColor(achievement.rarity) 
                  : "border-gray-200 bg-gray-50 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  {getRarityIcon(achievement.rarity)}
                  <span className={`
                    ${achievement.rarity === "common" ? "text-gray-700" : ""}
                    ${achievement.rarity === "rare" ? "text-blue-700" : ""}
                    ${achievement.rarity === "epic" ? "text-purple-700" : ""}
                    ${achievement.rarity === "legendary" ? "text-yellow-700" : ""}
                  `}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {getCategoryIcon(achievement.category)}
                  <span>
                    {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-yellow-600 text-sm font-semibold">
                  <FaStar size={12} />
                  <span>{achievement.points}</span>
                </div>
              </div>

              {achievement.earned ? (
                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-600" />
                    <span>Earned on {achievement.earnedDate}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(achievement.progress / achievement.totalRequired) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.totalRequired}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try selecting a different filter category</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}