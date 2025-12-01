"use client";

import Sidebar from "../../components/Sidebar";

const mockStoreItems = [
  { id: "skin1", name: "Dark Theme Skin", price: 500 },
  { id: "skin2", name: "Neon Theme Skin", price: 750 },
  { id: "boost1", name: "XP Boost 2x", price: 300 },
  { id: "boost2", name: "Double Coins", price: 400 },
];

export default function StorePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Store</h1>
          <p className="text-center text-gray-600 mb-8">
            Buy skins, boosts, and power-ups to enhance your gaming experience.
          </p>

          {/* Store Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockStoreItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow rounded p-6 flex flex-col justify-between"
              >
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">Price: {item.price} Coins</p>
                <button className="mt-auto py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
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
