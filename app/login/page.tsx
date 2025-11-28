"use client";

import { useState } from "react";

export default function LoginRegisterPage() {
  const [mode, setMode] = useState("login"); // "login" or "register"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-gray-200 px-6">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl shadow-xl border border-gray-800">

        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-center font-semibold ${
              mode === "login"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-center font-semibold ${
              mode === "register"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-[#0f1620] border border-gray-700 
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-[#0f1620] border border-gray-700 
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-500 
                         transition text-black shadow shadow-cyan-600/30"
            >
              Login
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-300">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-[#0f1620] border border-gray-700 
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Pick a cool gamer name"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-[#0f1620] border border-gray-700 
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-[#0f1620] border border-gray-700 
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold bg-green-600 hover:bg-green-500 
                         transition text-black shadow shadow-green-600/30"
            >
              Create Account
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
