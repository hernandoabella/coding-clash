"use client";

import { useState, useEffect } from "react";
import Quiz from "./QuizModals";
import { useSession } from "next-auth/react";

export default function DashboardContent() {
  const [mode, setMode] = useState("none");
  const [dailyStreak, setDailyStreak] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(1000);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      try {
        const [leader, achieve, game] = await Promise.all([
          fetch("/api/leaderboard").then((r) => r.json()),
          fetch("/api/user/achievements").then((r) => r.json()),
          fetch("/api/user/games?limit=5").then((r) => r.json()),
        ]);
        setLeaderboard(leader);
        setAchievements(achieve);
        setGames(game);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-gray-500 mt-8">Loading...</div>;

  const username = session?.user?.username || "Player";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {username} 👋</h2>
        <div className="flex justify-center gap-6 mt-4 text-gray-700">
          <p>🔥 <span className="font-semibold">{dailyStreak}</span> day streak</p>
          <p>🔔 <span className="font-semibold">{notifications}</span> notifications</p>
          <p>🧍 <span className="font-semibold">{onlinePlayers}</span> online</p>
        </div>
      </div>

      {/* Game Modes */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {mode === "none" && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Select Game Mode</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMode("pvp")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                Play vs Players
              </button>
              <button
                onClick={() => setMode("bot")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
              >
                Practice with Bot
              </button>
            </div>
          </div>
        )}

        {mode === "bot" && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Bot Mode 🤖</h3>
            <button
              onClick={() => setMode("none")}
              className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Back
            </button>
            <Quiz />
          </div>
        )}

        {mode === "pvp" && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Finding Opponent...</h3>
            <p className="text-gray-600 mb-4">Please wait while we match you with a player.</p>
            <button
              onClick={() => setMode("none")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500">No players yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {leaderboard.map((p) => (
              <div key={p.rank} className="flex justify-between py-2">
                <span className="font-medium">{p.rank}. {p.name}</span>
                <span className="text-gray-600">{p.score} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">🏅 Achievements</h3>
        {achievements.length === 0 ? (
          <p className="text-gray-500">No achievements yet</p>
        ) : (
          <div className="grid gap-3">
            {achievements.map((a) => (
              <div key={a.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition">
                <b className="text-gray-800">{a.name}</b>
                <p className="text-gray-600 text-sm">{a.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Games */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">🎮 Recent Games</h3>
        {games.length === 0 ? (
          <p className="text-gray-500">No games played yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {games.map((g) => (
              <div key={g.id} className="py-3">
                <p className="font-medium text-gray-800">
                  {g.language} <span className="text-gray-500">({g.difficulty})</span> — {g.score} pts
                </p>
                <p className="text-sm text-gray-600">
                  {g.correctAnswers}/{g.totalQuestions} correct —{" "}
                  {g.completed ? "✅ Completed" : "❌ Incomplete"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
