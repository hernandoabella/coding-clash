"use client";

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { mockUser } from "../../mocks/users";
import { FaUser, FaGamepad, FaTrophy, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function ProfilePage() {
  const user = useContext(UserContext) || mockUser;
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 py-16 px-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">
            Your Profile
          </h1>

          {/* User Info */}
          <section className="bg-gray-800 shadow-lg rounded p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">
              User Info
            </h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Level:</strong> {user.level}</p>
            <p><strong>Total Points:</strong> {user.points}</p>
          </section>

          {/* Recent Games */}
          <section className="bg-gray-800 shadow-lg rounded p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">
              Recent Games
            </h2>
            {user.recentGames.length > 0 ? (
              <ul className="space-y-2">
                {user.recentGames.map((game) => (
                  <li
                    key={game.id}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
                  >
                    <strong>{game.name}</strong> — Score: {game.score}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">You haven't played any games yet.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
