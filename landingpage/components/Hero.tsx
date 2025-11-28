"use client"

import { Sword } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroCodingClash() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center text-center px-6 bg-[#0d0d0d]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex items-center gap-4">
          <Sword className="w-20 h-20 text-[#93D7DA]" />
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Coding Clash
          </h1>
        </div>

        <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
          Donde los programadores se enfrentan y solo el más rápido sobrevive.
        </p>
      </motion.div>
    </section>
  );
}