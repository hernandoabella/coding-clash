"use client";

import { useState } from "react";

export default function ProfileTabs({ profile }: any) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="bg-white rounded-2xl shadow">
      <div className="flex border-b">
        {["overview", "stats", "badges"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
              tab === t ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "overview" && (
          <div>
            <h3 className="font-semibold mb-2">Overview</h3>
            <p>Games Played: {profile.stats.gamesPlayed}</p>
            <p>Wins: {profile.stats.wins}</p>
            <p>Total XP: {profile.stats.totalXP}</p>
          </div>
        )}
        {tab === "stats" && (
          <div>
            <h3 className="font-semibold mb-2">Stats</h3>
            <p>Correct Answers: {profile.stats.correctAnswers}</p>
            <p>Win Rate: {profile.stats.winRate}%</p>
            <p>Average Time: {profile.stats.averageTime}</p>
          </div>
        )}
        {tab === "badges" && (
          <div>
            <h3 className="font-semibold mb-2">Badges</h3>
            <ul className="list-disc ml-6">
              {profile.badges.map((b: any) => (
                <li key={b.id}>
                  {b.icon} {b.name} - {b.earned ? "✅" : "🔒"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
