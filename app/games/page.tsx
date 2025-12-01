"use client";

import Sidebar from "../../components/Sidebar";
import GameList from "../../components/GameList";
import { mockGames } from "../../mocks/games";

export default function GamesPage() {
  return (
    <div className="flex min-h-screen bg-[#0b0f14] text-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-cyan-400">
            Choose Your Game
          </h1>

          <p className="text-center text-gray-400 mb-8">
            Play solo, battle your friends, or challenge random players.
          </p>

          {/* Games Grid */}
          <GameList games={mockGames} />
        </div>
      </main>
    </div>
  );
}
