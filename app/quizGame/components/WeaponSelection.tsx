// app/quiz/components/WeaponSelection.tsx
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";
import { weapons } from "../data/weapons";

interface WeaponSelectionProps {
  selectedLanguage: string;
  selectedWeapon: string | null;
  onSelectWeapon: (weaponId: string) => void;
  onStartGame: () => void;
}

export default function WeaponSelection({
  selectedLanguage,
  selectedWeapon,
  onSelectWeapon,
  onStartGame,
}: WeaponSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCrown className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedLanguage} Quiz
          </h1>
          <p className="text-gray-600 mb-6">
            Pick your coding weapon before starting the battle!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {weapons.map((w) => (
              <button
                key={w.id}
                onClick={() => onSelectWeapon(w.id)}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition ${
                  selectedWeapon === w.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl">{w.icon}</div>
                <span className="font-semibold">{w.name}</span>
                <p className="text-xs text-gray-500">{w.description}</p>
              </button>
            ))}
          </div>

          <button
            onClick={onStartGame}
            disabled={!selectedWeapon}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
          >
            Start Quiz
          </button>
        </motion.div>
      </div>
    </div>
  );
}