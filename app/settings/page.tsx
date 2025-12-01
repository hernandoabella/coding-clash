"use client";

import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState(userContext?.user?.username || "");
  const [email, setEmail] = useState(userContext?.user?.email || "");
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    console.log("Saved settings:", { username, email, darkMode });
    alert("Settings saved! (mock)");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Settings</h1>

          <section className="bg-white shadow rounded p-6 space-y-6">
            {/* Profile Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  id="darkMode"
                  className="h-5 w-5"
                />
                <label htmlFor="darkMode">Enable Dark Mode</label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Save Settings
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
