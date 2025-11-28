"use client";

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { mockUser } from "../../mocks/users";
import Leaderboard from "./components/Leaderboard";
import RecentGames from "./components/RecentGames";
import StatsCard from "./components/StatsCard";
import Sidebar from "@/components/Sidebar";
import GameList from "../../components/GameList";
import { mockGames } from "../../mocks/games";
import { motion } from "framer-motion";
import { FaTrophy, FaChartLine, FaRegStar, FaUser, FaCode } from 'react-icons/fa'; // Iconos mejorados

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
  // Simulación de datos (asumiendo que mockUser tiene la misma estructura que UserContext)
  const user = useContext(UserContext)?.user || mockUser;

  // Calculamos los valores de las estadísticas fuera del JSX
  const gamesPlayed = user.recentGames.length;
  const topScore = Math.max(...user.recentGames.map((g: { score: number }) => g.score || 0));

  // Datos para StatsCard (añadimos icono y color para mejor visualización)
  const statsData = [
    { title: "Level", value: user.level, icon: FaRegStar, color: "text-yellow-400", sub: "Current Rank" },
    { title: "Points", value: user.points, icon: FaTrophy, color: "text-green-400", sub: "Total XP Earned" },
    { title: "Games Played", value: gamesPlayed, icon: FaCode, color: "text-cyan-400", sub: "Challenges Completed" },
    { title: "Top Score", value: topScore, icon: FaChartLine, color: "text-red-400", sub: "Highest Round Score" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <motion.main 
        className="flex-1 overflow-auto p-4 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* 1. Header de Bienvenida */}
          <motion.header 
            className="mb-8 p-6 bg-gradient-to-r from-blue-700 to-purple-800 rounded-xl shadow-2xl"
            variants={itemVariants}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
              <FaUser className="text-pink-400" />
              Welcome back, {user.name}!
            </h1>
            <p className="text-blue-200 mt-1">Ready for your next code challenge?</p>
          </motion.header>

          {/* 2. Stats Cards (Grid Moderno) */}
          <motion.section 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
          >
            {statsData.map((stat, index) => (
              <motion.div key={stat.title} variants={itemVariants}>
                {/* Asumimos que StatsCard puede recibir icon y color */}
                <StatsCard 
                    title={stat.title} 
                    value={stat.value} 
                    Icon={stat.icon} // Propiedad para el icono
                    color={stat.color} // Propiedad para el color
                    sub={stat.sub}
                />
              </motion.div>
            ))}
          </motion.section>

          {/* 3. Contenido Principal - Diseño de dos columnas */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Columna Izquierda (2/3): Juegos y Partidas Recientes */}
            <div className="lg:col-span-2 space-y-8">
                
              {/* Juegos Disponibles */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">🕹️ Quick Play Arena</h2>
                {/* Asumimos que GameList se adapta bien al tema oscuro */}
                <GameList games={mockGames} />
              </motion.section>

              {/* Partidas Recientes */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Recent Games</h2>
                {/* Asumimos que RecentGames se adapta al tema oscuro */}
                <RecentGames games={user.recentGames} />
              </motion.section>
            </div>

            {/* Columna Derecha (1/3): Leaderboard */}
            <div className="lg:col-span-1">
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">🏆 Global Leaderboard</h2>
                {/* Asumimos que Leaderboard se adapta al tema oscuro */}
                <Leaderboard />
              </motion.section>
            </div>

          </div>
          
        </div>
      </motion.main>
    </div>
  );
}
