import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  sub?: string;
  Icon: React.ComponentType<any>;
  color?: string; // tailwind text color, e.g., "text-yellow-400"
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, sub, Icon, color }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-2xl transition">
      <div className={`text-4xl ${color || "text-white"}`}>
        <Icon />
      </div>
      <div className="flex flex-col">
        <span className="text-gray-400 text-sm">{title}</span>
        <span className="text-2xl font-bold">{value}</span>
        {sub && <span className="text-gray-500 text-xs mt-1">{sub}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
