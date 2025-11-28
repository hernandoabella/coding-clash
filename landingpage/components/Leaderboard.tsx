"use client"

import React from "react";
import { motion } from "framer-motion";

// Mock data - replace with real data later
const mockLeaders = [
  { username: "CodeMaster", points: 2840, avatar: "👑", level: "Grand Master" },
  { username: "AlexPro", points: 2675, avatar: "⚡", level: "Diamond" },
  { username: "NandoDev", points: 2520, avatar: "🔥", level: "Diamond" },
  { username: "ScriptKid", points: 2380, avatar: "🚀", level: "Platinum" },
  { username: "JSamurai", points: 2250, avatar: "⚔️", level: "Platinum" },
  { username: "ByteWizard", points: 2150, avatar: "🧙", level: "Gold" },
  { username: "LogicQueen", points: 1980, avatar: "👑", level: "Gold" },
];

const getRankColor = (index: number) => {
  switch (index) {
    case 0: return "from-yellow-400 to-orange-400";
    case 1: return "from-gray-400 to-gray-300";
    case 2: return "from-amber-600 to-orange-300";
    default: return "from-purple-500 to-indigo-500";
  }
};

const getRankIcon = (index: number) => {
  switch (index) {
    case 0: return "🥇";
    case 1: return "🥈";
    case 2: return "🥉";
    default: return `#${index + 1}`;
  }
};

const Leaderboard: React.FC = () => (
  <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          Global Leaderboard
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Compete with the best programmers worldwide and claim your spot at the top
        </p>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden shadow-2xl shadow-purple-500/10"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="col-span-1 text-center">
            <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Rank</span>
          </div>
          <div className="col-span-6">
            <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Player</span>
          </div>
          <div className="col-span-3 text-center">
            <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Level</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">Points</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700/50">
          {mockLeaders.map((leader, index) => (
            <motion.div
              key={leader.username}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(59, 130, 246, 0.05)"
              }}
              className={`grid grid-cols-12 gap-4 p-6 items-center transition-all duration-300 ${
                index < 3 ? "bg-gradient-to-r from-gray-800/30 to-gray-800/10" : ""
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex justify-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index < 3 
                    ? `bg-gradient-to-br ${getRankColor(index)} text-gray-900 shadow-lg`
                    : "bg-gray-700 text-gray-300"
                }`}>
                  {getRankIcon(index)}
                </div>
              </div>

              {/* Player Info */}
              <div className="col-span-6 flex items-center space-x-4">
                <div className="text-2xl">{leader.avatar}</div>
                <div>
                  <div className="font-semibold text-white text-lg">
                    {leader.username}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      index < 3 ? "bg-green-400 animate-pulse" : "bg-cyan-400"
                    }`} />
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              </div>

              {/* Level */}
              <div className="col-span-3 text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  leader.level === "Grand Master" ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30" :
                  leader.level === "Diamond" ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30" :
                  leader.level === "Platinum" ? "bg-purple-400/20 text-purple-300 border border-purple-400/30" :
                  "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                }`}>
                  {leader.level}
                </span>
              </div>

              {/* Points */}
              <div className="col-span-2 text-right">
                <div className="text-white font-bold text-lg">
                  {leader.points.toLocaleString()}
                </div>
                <div className="text-cyan-400 text-xs font-semibold">
                  +{Math.floor(Math.random() * 50) + 20} today
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
          className="p-6 border-t border-gray-700 bg-gray-800/50 text-center"
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span>Live Ranking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full" />
              <span>Updates Every Hour</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30">
          <span>View Full Leaderboard</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
      >
        {[
          { number: "50K+", label: "Active Players" },
          { number: "1.2M", label: "Games Played" },
          { number: "15K", label: "Daily Battles" },
          { number: "2.4K", label: "Tournaments" }
        ].map((stat, index) => (
          <div key={stat.label} className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Leaderboard;