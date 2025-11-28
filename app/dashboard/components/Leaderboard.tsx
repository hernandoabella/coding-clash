"use client";

import { motion, Variants } from "framer-motion";
import { FaCrown, FaTrophy, FaChevronUp } from 'react-icons/fa'; // Importamos iconos de premio y movimiento

const mockLeaderboard = [
  { username: "CodeMaster", points: 1200 },
  { username: "BugHunter", points: 1100, isSelf: true }, // Simulamos que este es el usuario actual
  { username: "AlgoWizard", points: 1000 },
  { username: "DevNinja", points: 900 },
  { username: "LogicBoss", points: 850 },
  { username: "ScriptKiddie", points: 700 },
];

// -----------------------------------------------------
// Variantes de Framer Motion
// -----------------------------------------------------

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.3 } 
  },
};

export default function Leaderboard() {
  return (
    <motion.ul 
        className="space-y-3 p-4 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
    >
      {mockLeaderboard.map((user, index) => {
        const rank = index + 1;
        const isTopThree = rank <= 3;
        const isSelf = user.isSelf;

        let rankStyle = "bg-gray-700 text-gray-400";
        let pointStyle = "text-gray-200";
        let rowClass = "bg-gray-700/50 hover:bg-gray-700";

        if (rank === 1) {
          rankStyle = "bg-yellow-500 text-gray-900";
          pointStyle = "text-yellow-400 font-extrabold";
          rowClass = "bg-yellow-500/10 border-l-4 border-yellow-500 hover:bg-yellow-500/20";
        } else if (rank === 2) {
          rankStyle = "bg-gray-400 text-gray-900";
          pointStyle = "text-gray-300 font-bold";
        } else if (rank === 3) {
          rankStyle = "bg-amber-700 text-white";
          pointStyle = "text-amber-400 font-bold";
        }

        if (isSelf) {
          rowClass = "bg-blue-600/30 border-l-4 border-blue-400 hover:bg-blue-600/40 font-bold";
          pointStyle = "text-cyan-300 font-extrabold";
        }

        return (
          <motion.li 
            key={index} 
            variants={listItemVariants}
            className={`p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${rowClass}`}
          >
            <div className="flex items-center gap-4">
              {/* Ranking Badge */}
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${rankStyle}`}>
                {isTopThree ? <FaCrown className="w-4 h-4" /> : rank}
              </span>

              {/* Username */}
              <span className={`${isSelf ? 'text-white' : 'text-gray-200'}`}>
                {user.username} {isSelf && <span className="text-blue-400 text-xs">(You)</span>}
              </span>
            </div>

            {/* Puntos y Separador */}
            <div className="flex items-center gap-2">
              <span className={`text-lg ${pointStyle}`}>
                {user.points}
              </span>
              <span className="text-gray-500 text-sm">PTS</span>
            </div>
          </motion.li>
        );
      })}
      
      {/* Footer del Leaderboard (Ejemplo de posición del usuario) */}
      <div className="pt-4 text-center border-t border-gray-700 mt-4">
        <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Your Rank: <FaChevronUp className="text-green-400" /> <span className="font-bold text-gray-400">#4 (Simulated)</span>
        </p>
      </div>
    </motion.ul>
  );
}