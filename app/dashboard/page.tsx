"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import GameList from "../../components/GameList";
import Leaderboard from "./components/Leaderboard";
import RecentGames from "./components/RecentGames";
import StatsCard from "../../components/StatsCard";
import { motion } from "framer-motion";
import {
  FaUser,
  FaSignOutAlt,
  FaRegStar,
  FaTrophy,
  FaCode,
  FaChartLine
} from "react-icons/fa";

// Framer Motion variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch usuario logueado desde backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading your dashboard...
      </div>
    );
  }

  if (!currentUser) return null; // seguridad

  const gamesPlayed = currentUser.recentGames?.length || 0;
  const topScore = Math.max(
    ...(currentUser.recentGames || []).map((g: any) => g.score || 0),
    0
  );

  const statsData = [
    { title: "Level", value: currentUser.level, icon: FaRegStar, color: "text-yellow-400", sub: "Current Rank" },
    { title: "Points", value: currentUser.points, icon: FaTrophy, color: "text-green-400", sub: "Total XP Earned" },
    { title: "Games Played", value: gamesPlayed, icon: FaCode, color: "text-cyan-400", sub: "Challenges Completed" },
    { title: "Top Score", value: topScore, icon: FaChartLine, color: "text-red-400", sub: "Highest Round Score" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <motion.main
        className="flex-1 overflow-auto p-4 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <motion.header
            className="mb-8 p-6 bg-gradient-to-r from-blue-700 to-purple-800 rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
                <FaUser className="text-pink-400" /> Welcome back, {currentUser.username}!
              </h1>
              <p className="text-blue-200 mt-1">Ready for your next code challenge?</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold shadow-lg"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </motion.header>

          {/* STATS */}
          <motion.section
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
          >
            {statsData.map((stat) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  Icon={stat.icon}
                  color={stat.color}
                  sub={stat.sub}
                />
              </motion.div>
            ))}
          </motion.section>

          {/* MAIN CONTENT */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">🕹️ Quick Play Arena</h2>
                <GameList games={currentUser.games || []} />
              </motion.section>

              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Recent Games</h2>
                <RecentGames games={currentUser.recentGames || []} />
              </motion.section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1">
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">🏆 Global Leaderboard</h2>
                <Leaderboard />
              </motion.section>
            </div>

          </div>
        </div>
      </motion.main>
    </div>
  );
}
