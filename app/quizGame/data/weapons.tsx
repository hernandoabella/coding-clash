// data/weapons.tsx
import { FaBolt, FaClock, FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import { Weapon } from "../types";

export const weapons: Weapon[] = [
  {
    id: "double-points",
    name: "Double Points",
    icon: <FaBolt className="text-yellow-500" />,
    description: "Earn double points on your next correct answer.",
  },
  {
    id: "extra-time",
    name: "Extra Time",
    icon: <FaClock className="text-blue-500" />,
    description: "Get +10 seconds on a question.",
  },
  {
    id: "shield",
    name: "Shield",
    icon: <FaShieldAlt className="text-green-500" />,
    description: "Block one wrong answer from resetting your streak.",
  },
  {
    id: "retry",
    name: "Retry",
    icon: <FaSyncAlt className="text-purple-500" />,
    description: "Retry one wrong question immediately.",
  },
];