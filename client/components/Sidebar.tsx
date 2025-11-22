"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaGamepad, FaTrophy, FaShoppingCart, FaCog } from "react-icons/fa";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Games", href: "/games", icon: <FaGamepad /> },
  { name: "Leaderboard", href: "/leaderboard", icon: <FaTrophy /> },
  { name: "Store", href: "/store", icon: <FaShoppingCart /> },
  { name: "Settings", href: "/settings", icon: <FaCog /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 text-gray-900 min-h-screen p-6 flex flex-col border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">CODING BATTLE</h2>

      <nav className="flex flex-col space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 py-2 px-4 rounded hover:bg-gray-100 transition ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
