"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface User {
  id: string;
  username: string;
  xp: number;
  level: number;
}

interface GameSession {
  id: string;
  language: string;
  difficulty: string;
  score: number;
  completed: boolean;
}

interface Achievement {
  id: string;
  achievementType: string;
  unlockedAt: string;
}

export default function DashboardPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, playersRes, achRes, gamesRes] = await Promise.all([
          fetch(`/api/user/${id}`),
          fetch("/api/top-players"),
          fetch("/api/recent-achievements"),
          fetch("/api/recent-games"),
        ]);

        const userData = await userRes.json();
        const playersData = await playersRes.json();
        const achData = await achRes.json();
        const gamesData = await gamesRes.json();

        setUser(userData);
        setTopPlayers(playersData);
        setAchievements(achData);
        setRecentGames(gamesData);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    }
    fetchData();
  }, [id]);

  if (!user) return <div className="text-center text-gray-400 mt-20">Loading dashboard...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-950 text-gray-100">
      {/* Greeting */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-6 text-center text-teal-400"
      >
        Welcome back, {user.username}! 👋
      </motion.h1>

      {/* Stats overview */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-6">
          <div className="bg-gray-800 p-4 rounded-2xl shadow-md text-center">
            <p className="text-gray-400">Level</p>
            <p className="text-2xl font-semibold text-teal-400">{user.level}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl shadow-md text-center">
            <p className="text-gray-400">XP</p>
            <p className="text-2xl font-semibold text-teal-400">{user.xp}</p>
          </div>
        </div>
      </div>

      {/* Main Row: Top Players | Recent Achievements | Recent Games */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Players */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-teal-300">🏆 Top Players</h2>
          <ul className="space-y-2">
            {topPlayers.length > 0 ? (
              topPlayers.map((p) => (
                <li key={p.id} className="flex justify-between border-b border-gray-700 pb-2">
                  <span>{p.username}</span>
                  <span className="text-teal-400">{p.xp} XP</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No players yet.</p>
            )}
          </ul>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">🎯 Recent Achievements</h2>
          <ul className="space-y-2">
            {achievements.length > 0 ? (
              achievements.map((a) => (
                <li key={a.id} className="border-b border-gray-700 pb-2">
                  <p className="font-medium">{a.achievementType.replaceAll("_", " ")}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.unlockedAt).toLocaleString()}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No achievements yet.</p>
            )}
          </ul>
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-300">🎮 Recent Games</h2>
          <ul className="space-y-2">
            {recentGames.length > 0 ? (
              recentGames.map((g) => (
                <li key={g.id} className="border-b border-gray-700 pb-2">
                  <p className="font-medium">
                    {g.language} - {g.difficulty}
                  </p>
                  <p className="text-sm text-gray-400">
                    Score: <span className="text-teal-400">{g.score}</span>
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No games played yet.</p>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
