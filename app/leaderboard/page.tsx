"use client";

import Sidebar from "../../components/Sidebar";

const mockLeaderboard = [
  { username: "CodeMaster", points: 1200 },
  { username: "BugHunter", points: 1100 },
  { username: "AlgoWizard", points: 1000 },
  { username: "DevNinja", points: 900 },
  { username: "ScriptSamurai", points: 850 },
];

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen bg-[#0b0f14] text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-cyan-400">
            Leaderboard
          </h1>
          <p className="text-center text-gray-400 mb-8">
            See who’s leading the CodeBattle rankings!
          </p>

          {/* Leaderboard Table */}
          <div className="bg-[#111827] shadow-xl shadow-black/40 rounded overflow-hidden border border-gray-800">
            <table className="min-w-full text-left">
              <thead className="bg-[#1f2937] text-gray-300">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Points</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map((user, index) => (
                  <tr
                    key={user.username}
                    className={
                      index % 2 === 0
                        ? "bg-[#0f1620]"
                        : "bg-[#131c27]"
                    }
                  >
                    <td className="px-6 py-3 font-semibold text-cyan-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3">{user.username}</td>
                    <td className="px-6 py-3 font-bold text-blue-400">
                      {user.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
