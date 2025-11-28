"use client";

import Link from "next/link";
import { motion } from "framer-motion"; // Importamos motion

interface GameCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    icon?: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <motion.div
        className="relative p-6 rounded-xl border border-gray-700 
                   bg-gray-800 text-gray-200 
                   cursor-pointer transition-all duration-300
                   overflow-hidden group text-left" // Cambiado a text-left para mejor lectura
        
        // Animaciones de Framer Motion
        whileHover={{ 
            y: -5, 
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)", // Sombra azul sutil
            borderColor: '#3b82f6' // Borde azul al hacer hover
        }}
        whileTap={{ scale: 0.98 }}
      >
        
        {/* Elemento decorativo flotante (Solo visible en hover) */}
        <motion.div 
            className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full opacity-10 blur-xl group-hover:w-20 group-hover:h-20 transition-all duration-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        />

        <div className="relative z-10">
            {/* Icono del juego */}
            <div className={`text-4xl mb-4 text-cyan-400 group-hover:text-blue-400 transition-colors duration-300`}>
                {/* Nota: Asume que game.icon es un emoji o un componente de icono */}
                {game.icon || "🎮"}
            </div>

            {/* Nombre del juego */}
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300">
                {game.name}
            </h3>

            {/* Descripción del juego */}
            <p className="text-gray-400 text-sm leading-relaxed">
                {game.description}
            </p>
        </div>
      </motion.div>
    </Link>
  );
}