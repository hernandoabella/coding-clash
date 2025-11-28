"use client";

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { mockUser } from "../../mocks/users";
import Leaderboard from "./components/Leaderboard";
import RecentGames from "./components/RecentGames";
import StatsCard from "./components/StatsCard";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const user = useContext(UserContext)?.user || mockUser;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <StatsCard title="Level" value={user.level} />
            <StatsCard title="Points" value={user.points} />
            <StatsCard title="Games Played" value={user.recentGames.length} />
            <StatsCard
              title="Top Score"
              value={Math.max(...user.recentGames.map((g) => g.score))}
            />
          </div>

          {/* Recent Games */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Recent Games</h2>
            <RecentGames games={user.recentGames} />
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
}
