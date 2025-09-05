"use client";

import { JSX } from "react";
import { FaTrophy, FaCrown, FaFire, FaUser, FaArrowUp } from "react-icons/fa";

// Define TypeScript interfaces
interface Player {
  name: string;
  score: number;
  battles: number;
  wins: number;
  language: string;
  rank: number;
  image: string | null;
  trend: "up" | "down";
}

export default function TopPlayers() {
  const topPlayers: Player[] = [
    {
      name: "CodeWizard",
      score: 2845,
      battles: 127,
      wins: 104,
      language: "JavaScript",
      rank: 1,
      image: null,
      trend: "up"
    },
    {
      name: "SyntaxSlasher",
      score: 2750,
      battles: 142,
      wins: 118,
      language: "Python",
      rank: 2,
      image: null,
      trend: "up"
    },
    {
      name: "ByteBrawler",
      score: 2680,
      battles: 135,
      wins: 97,
      language: "HTML/CSS",
      rank: 3,
      image: null,
      trend: "down"
    },
    {
      name: "LogicLegion",
      score: 2520,
      battles: 118,
      wins: 89,
      language: "JavaScript",
      rank: 4,
      image: null,
      trend: "up"
    },
    {
      name: "AlgorithmAce",
      score: 2480,
      battles: 96,
      wins: 82,
      language: "Python",
      rank: 5,
      image: null,
      trend: "up"
    }
  ];

  const getRankColor = (rank: number): string => {
    switch(rank) {
      case 1: return "bg-yellow-100 border-yellow-300";
      case 2: return "bg-gray-100 border-gray-300";
      case 3: return "bg-orange-100 border-orange-300";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  const getRankIcon = (rank: number): JSX.Element => {
    switch(rank) {
      case 1: return <FaTrophy className="text-yellow-500" />;
      case 2: return <FaCrown className="text-gray-500" />;
      case 3: return <FaFire className="text-orange-500" />;
      default: return <span className="text-gray-700 font-bold">{rank}</span>;
    }
  };

  const getLanguageColor = (language: string): string => {
    switch(language) {
      case "JavaScript": return "bg-yellow-100 text-yellow-800";
      case "Python": return "bg-blue-100 text-blue-800";
      case "HTML/CSS": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Coding Champions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the top performers who dominate the coding battles and inspire our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Top 3 Players - Featured Cards */}
          {topPlayers.slice(0, 3).map((player) => (
            <div 
              key={player.rank}
              className={`rounded-2xl border-2 p-6 shadow-lg transition-transform hover:scale-105 ${getRankColor(player.rank)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2">
                    {getRankIcon(player.rank)}
                  </div>
                  <span className="ml-3 text-lg font-bold text-gray-900">{player.name}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLanguageColor(player.language)}`}>
                  {player.language}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                    {player.image ? (
                      <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUser className="text-3xl" />
                    )}
                  </div>
                  {player.rank === 1 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <FaTrophy className="text-sm" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{player.score}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{player.wins}</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{player.battles} battles</span>
                <span className={`flex items-center text-sm ${player.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {player.trend === "up" ? <FaArrowUp className="mr-1" /> : "↓"}
                  {player.trend === "up" ? "Rising" : "Falling"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" /> Full Leaderboard
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-gray-600 font-medium">Rank</th>
                  <th className="pb-3 text-left text-gray-600 font-medium">Coder</th>
                  <th className="pb-3 text-left text-gray-600 font-medium">Language</th>
                  <th className="pb-3 text-right text-gray-600 font-medium">Score</th>
                  <th className="pb-3 text-right text-gray-600 font-medium">Wins</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player) => (
                  <tr key={player.rank} className="border-b border-gray-100 hover:bg-blue-50">
                    <td className="py-4">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full ${player.rank <= 3 ? getRankColor(player.rank) : "bg-gray-100"}`}>
                          {getRankIcon(player.rank)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-gray-900">{player.name}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(player.language)}`}>
                        {player.language}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-gray-900">{player.score}</td>
                    <td className="py-4 text-right text-gray-700">{player.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              View Complete Leaderboard
              <FaArrowUp className="ml-2 transform rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}