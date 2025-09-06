"use client";

import { useState } from "react";
import Quiz from "./Quiz";

interface Props {
  username: string;
}

export default function DashboardContent({ username }: Props) {
  const [mode, setMode] = useState<"none" | "bot" | "pvp">("none");

  return (
    <div>
      {/* Squares Row */}
      {mode === "none" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Play vs Random Opponent */}
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">
              {username} vs Random Opponent
            </h3>
            <button
              onClick={() => setMode("pvp")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Match
            </button>
          </div>

          {/* Play with Bot */}
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">
              {username} vs Bot
            </h3>
            <button
              onClick={() => setMode("bot")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Start vs Bot
            </button>
          </div>
        </div>
      )}

      {/* Bot Quiz Mode */}
      {mode === "bot" && <Quiz />}

      {/* Placeholder for PvP */}
      {mode === "pvp" && (
        <div className="p-6 bg-white rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold">Multiplayer Coming Soon 🚀</h3>
          <button
            onClick={() => setMode("none")}
            className="mt-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
