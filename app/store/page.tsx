"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";

const mockStoreItems = [
  { id: "skin1", name: "Dark Theme Skin", price: 500 },
  { id: "skin2", name: "Neon Theme Skin", price: 750 },
  { id: "boost1", name: "XP Boost 2x", price: 300 },
  { id: "boost2", name: "Double Coins", price: 400 },
];

export default function StorePage() {
  const [darkMode, setDarkMode] = useState(true); // default dark mode

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header with toggle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-center mb-2">Store</h1>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-center`}>
                Buy skins, boosts, and power-ups to enhance your gaming experience.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="darkModeToggle" className="font-semibold">
                Dark Mode
              </label>
              <input
                id="darkModeToggle"
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="h-5 w-5"
              />
            </div>
          </div>

          {/* Store Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockStoreItems.map((item) => (
              <div
                key={item.id}
                className={`p-6 flex flex-col justify-between rounded shadow transition
                  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
              >
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                  Price: {item.price} Coins
                </p>
                <button
                  className={`mt-auto py-2 px-4 rounded transition
                    ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
