// components/LoadingScreen.tsx
import { motion } from "framer-motion";
import { FaCode, FaRobot, FaBrain, FaRocket, FaSpinner } from "react-icons/fa";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "quiz" | "ai" | "competitive" | "minimal";
}

export default function LoadingScreen({ 
  title = "Preparing Your Quiz", 
  subtitle = "Getting everything ready for your coding challenge...",
  variant = "default"
}: LoadingScreenProps) {
  
  const getVariantConfig = () => {
    switch (variant) {
      case "quiz":
        return {
          icon: <FaCode className="w-8 h-8" />,
          gradient: "from-blue-500 to-purple-600",
          bgGradient: "from-blue-50 via-white to-purple-50"
        };
      case "ai":
        return {
          icon: <FaRobot className="w-8 h-8" />,
          gradient: "from-green-500 to-teal-600",
          bgGradient: "from-green-50 via-white to-teal-50"
        };
      case "competitive":
        return {
          icon: <FaRocket className="w-8 h-8" />,
          gradient: "from-red-500 to-orange-600",
          bgGradient: "from-red-50 via-white to-orange-50"
        };
      case "minimal":
        return {
          icon: <FaBrain className="w-6 h-6" />,
          gradient: "from-gray-500 to-gray-600",
          bgGradient: "from-gray-50 via-white to-gray-100"
        };
      default:
        return {
          icon: <FaCode className="w-8 h-8" />,
          gradient: "from-purple-500 to-indigo-600",
          bgGradient: "from-purple-50 via-white to-indigo-50"
        };
    }
  };

  const { icon, gradient, bgGradient } = getVariantConfig();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${bgGradient} p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          }}
          className={`w-24 h-24 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-800 mb-3"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8"
        >
          {subtitle}
        </motion.p>

        {/* Animated Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`w-12 h-12 border-4 border-${gradient.split(' ')[0]}/20 border-t-${gradient.split(' ')[0]} rounded-full`}
          />
        </motion.div>

        {/* Progress Dots (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full`}
            />
          ))}
        </motion.div>

        {/* Optional Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 p-4 bg-white/50 rounded-lg border border-gray-200/50"
        >
          <p className="text-sm text-gray-500">
            💡 Pro tip: Read questions carefully and check for edge cases!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}