"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons"; // Import IconType for type safety

interface StatsCardProps {
  title: string;
  value: number;
  Icon: IconType; // Componente de icono de React Icons
  color: string;  // Clase de color para el icono (ej: "text-cyan-400")
  sub?: string;   // Subtítulo/contexto
}

export default function StatsCard({ title, value, Icon, color, sub }: StatsCardProps) {
  return (
    <motion.div
      className="relative p-6 rounded-xl shadow-lg 
                 bg-gray-800 border border-gray-700 
                 hover:border-blue-500 transition-all duration-300
                 cursor-pointer overflow-hidden group"
      // Animation: Lift the card slightly and add shadow on hover
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* --- 1. Background Hover Effect (Glow) --- */}
      <motion.div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${color.replace('text-', 'bg-')}/50`}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.5 }}
      />

      {/* --- 2. Icon (Positioned Top Right) --- */}
      <div className="absolute top-4 right-4 text-4xl opacity-50">
        <Icon className={`${color} group-hover:opacity-100 transition-opacity duration-300`} />
      </div>

      {/* --- 3. Content --- */}
      <div className="relative z-10">
        {/* Title */}
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
        
        {/* Value */}
        <p className="text-4xl font-extrabold text-white mb-3">
          {value}
        </p>

        {/* Subtitle/Context */}
        {sub && (
          <p className={`text-xs ${color} font-medium`}>
            {sub}
          </p>
        )}
      </div>
      
    </motion.div>
  );
}