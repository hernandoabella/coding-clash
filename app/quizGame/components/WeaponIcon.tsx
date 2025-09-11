// components/WeaponIcon.tsx
import { FaBolt, FaClock, FaShieldAlt, FaSyncAlt } from "react-icons/fa";

interface WeaponIconProps {
  icon: string;
  color: string;
  size?: number;
}

export default function WeaponIcon({ icon, color, size = 24 }: WeaponIconProps) {
  const getIcon = () => {
    switch (icon) {
      case "bolt":
        return <FaBolt className={`text-${color}-500`} size={size} />;
      case "clock":
        return <FaClock className={`text-${color}-500`} size={size} />;
      case "shield":
        return <FaShieldAlt className={`text-${color}-500`} size={size} />;
      case "sync":
        return <FaSyncAlt className={`text-${color}-500`} size={size} />;
      default:
        return null;
    }
  };

  return getIcon();
}