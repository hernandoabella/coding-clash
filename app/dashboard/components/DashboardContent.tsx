"use client";

import { useState } from "react";
import { FaUserFriends, FaRobot } from "react-icons/fa";

const activeUsers = ["Alice", "Bob", "Charlie", "David", "Eva"]; // Example active users

export default function DashboardContent({ username }: { username: string }) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handlePlayRandom = () => {
    alert(`Starting a match for ${username} vs Random Opponent...`);
  };

  const handlePlayUser = () => {
    if (!selectedUser) {
      alert("Please select a user to challenge.");
      return;
    }
    alert(`Starting a match for ${username} vs ${selectedUser}...`);
  };

  const handlePlayBot = () => {
    alert(`Starting a match for ${username} vs Bot...`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Play vs Random/User */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition">
        <div className="flex items-center mb-4">
          <FaUserFriends className="text-blue-600 text-3xl mr-3" />
          <h2 className="text-xl font-semibold">Play vs Player</h2>
        </div>
        <p className="mb-4">Challenge another player in a coding quiz! Select an active user or play against a random opponent.</p>

        {/* Active Users Selector */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-sm">Select an active user:</label>
          <select
            className="border rounded p-2 w-full"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Random Opponent --</option>
            {activeUsers.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePlayRandom}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Play Random
          </button>
          <button
            onClick={handlePlayUser}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Challenge
          </button>
        </div>
      </div>

      {/* Play vs Bot */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition">
        <div className="flex items-center mb-4">
          <FaRobot className="text-purple-600 text-3xl mr-3" />
          <h2 className="text-xl font-semibold">Play vs Bot</h2>
        </div>
        <p className="mb-4">Practice your coding skills by playing against an AI bot. Perfect for warming up!</p>

        {/* Difficulty Selector */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-sm">Select difficulty:</label>
          <select className="border rounded p-2 w-full">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePlayBot}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
        >
          Play vs Bot
        </button>
      </div>
    </div>
  );
}
