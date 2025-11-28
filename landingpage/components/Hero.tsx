"use client";

import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

export default function GameHeroSection() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants: Variants = { // <-- Aseguramos el tipado explícito (Variants)
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      // Usamos la cadena de texto reconocida por Framer Motion
      ease: "easeOut" 
    }
  }
};

  const glowVariants = {
    initial: { 
      backgroundPosition: "0% 50%",
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
    },
    hover: { 
      backgroundPosition: "100% 50%",
      boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)",
      scale: 1.02
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }} 
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 w-full">
        <div className="max-w-6xl mx-auto w-full text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* Main Title with Glow Effect */}
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
              variants={itemVariants}
            >
              
              <motion.span 
                className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(50, 123, 225, 0.5)",
                    "0 0 30px rgba(35, 148, 218, 0.8)",
                    "0 0 20px rgba(47, 165, 212, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CODING CLASH
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 font-light"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Code • Solve • Battle
              </span> 
            </motion.p>


            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => router.push("/login")}
                className="px-12 py-4 text-lg font-bold rounded-2xl relative overflow-hidden group"
                variants={glowVariants}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)",
                  backgroundSize: "200% 200%"
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  🚀 Start Coding Battle
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </motion.button>

            </motion.div>

           
          </motion.div>
        </div>

        
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="relative py-20 md:py-28 px-4 w-full bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto w-full">
          <motion.h2 
            className="text-4xl md:text-6xl font-black text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <motion.div
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-400/50 transition-all duration-500 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="text-4xl mb-6 mt-4">🎮</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Choose Your Battle</h3>
              <p className="text-gray-300 leading-relaxed">
                Select from code quizzes, bug fixing arenas, algorithm battles, or real-time coding duels. Each mode offers unique challenges.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-400/50 transition-all duration-500 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="text-4xl mb-6 mt-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Fight & Conquer</h3>
              <p className="text-gray-300 leading-relaxed">
                Battle against intelligent AI or real players worldwide. Real-time code execution and instant feedback make every match intense.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-400/50 transition-all duration-500 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <div className="text-4xl mb-6 mt-4">🏆</div>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Rise & Dominate</h3>
              <p className="text-gray-300 leading-relaxed">
                Earn XP, unlock achievements, collect badges, and climb the global leaderboard. Track your progress with detailed analytics.
              </p>
            </motion.div>
          </div>

          {/* Additional Features */}
          <motion.div
            className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { icon: "🌍", title: "Global Arena", desc: "Compete with coders worldwide" },
              { icon: "⚔️", title: "Live Duels", desc: "Real-time coding battles" },
              { icon: "📊", title: "Smart Analytics", desc: "Detailed performance insights" },
              { icon: "🎯", title: "Daily Challenges", desc: "Fresh problems every day" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-cyan-300">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}