"use client";

import { FaUserFriends, FaRobot } from "react-icons/fa";

export default function DashboardContent({ username }: { username: string }) {
  return (
    <div className="flex gap-6 p-6">
      {/* Play vs Opponent */}
      <div className="flex-1 bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center">
        <FaUserFriends className="text-blue-500 text-5xl mb-4" />
        <h3 className="text-xl font-bold mb-2">
          {username} vs Random Opponent
        </h3>
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Play Now
        </button>
      </div>

      {/* Play vs Bot */}
      <div className="flex-1 bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center">
        <FaRobot className="text-green-500 text-5xl mb-4" />
        <h3 className="text-xl font-bold mb-2">{username} vs Bot</h3>
        <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Play Now
        </button>
      </div>
    </div>
  );
}
