"use client";

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { mockUser } from "../../mocks/users";

export default function ProfilePage() {
  // Use mock user for now
  const user = useContext(UserContext) || mockUser;

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Profile</h1>

        <section className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Info</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Level:</strong> {user.level}</p>
          <p><strong>Total Points:</strong> {user.points}</p>
        </section>

        <section className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Games</h2>
          {user.recentGames.length > 0 ? (
            <ul className="space-y-2">
              {user.recentGames.map((game) => (
                <li key={game.id} className="p-2 bg-gray-100 rounded">
                  <strong>{game.name}</strong> — Score: {game.score}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't played any games yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
