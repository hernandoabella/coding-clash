"use client";

import { motion, Variants } from "framer-motion";
import { FaCalendarAlt, FaCode, FaCheckCircle } from 'react-icons/fa'; // Importamos iconos

interface RecentGame {
  id: string;
  name: string;
  score: number;
}

interface RecentGamesProps {
  games: RecentGame[];
}

// -----------------------------------------------------
// Variantes de Framer Motion
// -----------------------------------------------------

// Variante para el contenedor de la lista
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Variante para cada ítem de la lista
const listItemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.4 } 
  },
};

export default function RecentGames({ games }: RecentGamesProps) {
  if (games.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 text-center">
        <FaCalendarAlt className="inline-block text-4xl text-gray-500 mb-2" />
        <p className="text-gray-500 font-medium">No recent games played. Start a challenge now!</p>
      </div>
    );
  }

  // Limitamos la lista a, por ejemplo, los 5 juegos más recientes para no saturar
  const displayedGames = games.slice(0, 5);

  return (
    <motion.ul 
        className="space-y-4"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
    >
      {displayedGames.map((game) => (
        <motion.li 
            key={game.id} 
            variants={listItemVariants}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg 
                       flex justify-between items-center transition-all duration-300
                       hover:bg-gray-700/70 hover:shadow-lg group"
        >
          {/* Nombre del juego y contexto */}
          <div className="flex items-center gap-3">
            <FaCode className="text-blue-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-gray-200 font-medium">{game.name}</span>
          </div>

          {/* Puntuación y marcador */}
          <div className="flex items-center gap-4">
            <span className="text-sm uppercase font-semibold text-gray-400">Score:</span>
            <span className="font-extrabold text-xl text-green-400">
                {game.score}
            </span>
            <FaCheckCircle className="text-green-500" />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}