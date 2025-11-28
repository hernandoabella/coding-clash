"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
// Importaciones de iconos
import { FaBars, FaTimes, FaRocket, FaCode } from 'react-icons/fa'; 

// Datos de navegación
const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Leaderboard", href: "#leaderboard" },
  { name: "Pricing", href: "#pricing" },
];

// -----------------------------------------------------
// Variantes de Framer Motion para el menú lateral
// -----------------------------------------------------

const sidebarVariants: Variants = {
  hidden: { x: "100%", opacity: 0, transition: { type: "tween", duration: 0.3 } },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "tween", 
      duration: 0.3,
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};


export default function MobileResponsiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función de manejo de enlaces (cierra el menú al hacer clic)
  const handleLinkClick = (href: string) => {
    // Aquí puedes usar router.push(href) si estás en Next.js
    console.log(`Navigating to ${href}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* Logo/Brand (Visible en todas las resoluciones) */}
        <motion.div 
            className="flex items-center text-xl font-bold text-white tracking-wider cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
          <FaCode className="text-cyan-400 mr-2" />
          ClashCode
        </motion.div>

        {/* --- Menú de Escritorio (Oculto en móvil) --- */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-cyan-400 font-medium transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault(); 
                handleLinkClick(link.href);
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* --- CTA y Botón del Menú (Alineación a la Derecha) --- */}
        <div className="flex items-center space-x-4">
          
          {/* Botón CTA (Visible en todas las resoluciones) */}
          <motion.button
            onClick={() => handleLinkClick("/signup")}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="flex items-center gap-1">
                <FaRocket className="text-sm" /> Join Now
            </span>
          </motion.button>

          {/* Botón Hamburguesa (Solo Visible en móvil) */}
          <button
            className="md:hidden text-gray-300 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* --- Menú Móvil Deslizable (AnimatePresence controla la entrada/salida) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 shadow-2xl border-l border-gray-700 p-6 flex flex-col space-y-4"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="block text-xl text-gray-200 py-3 border-b border-gray-800 hover:text-cyan-400 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault(); 
                  handleLinkClick(link.href);
                }}
                variants={linkVariants}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// Puedes importar este componente y usarlo en tu layout principal:
// <MobileResponsiveHeader />