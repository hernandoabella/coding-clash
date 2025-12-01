"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaGamepad,
  FaTrophy,
  FaShoppingCart,
  FaCog,
  FaCode,
} from "react-icons/fa";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Play", href: "/games", icon: <FaGamepad /> },
  { name: "Leaderboard", href: "/leaderboard", icon: <FaTrophy /> },
  { name: "Store", href: "/store", icon: <FaShoppingCart /> },
  { name: "Settings", href: "/settings", icon: <FaCog /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 min-h-screen p-6 flex flex-col 
                 bg-gray-900 border-r border-gray-800 
                 text-gray-200 shadow-xl"
    >
      {/* Título/Logo */}
      <h2 className="text-2xl font-black mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center gap-2">
        <FaCode className="text-cyan-400" />
        Coding Clash
      </h2>

      {/* Navegación */}
      <nav className="flex flex-col space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-4 py-3 px-4 rounded-lg 
                transition-all duration-200
                ${isActive
                  ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-cyan-400"
                }
              `}
            >
              <span
                className={`text-xl ${isActive ? "text-white" : "text-cyan-400/80"
                  }`}
              >
                {link.icon}
              </span>
              <span className={`${isActive ? "" : "font-medium"}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Estado/Usuario */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <p>Status: Online</p>
        </div>
      </div>
    </aside>
  );
}
