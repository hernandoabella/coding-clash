"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaGamepad, FaTrophy, FaComments, FaCrown, FaStore } from "react-icons/fa";

const navItems = [
  { href: "/dashboard", label: "Game", icon: FaGamepad },
  { href: "/leaderboard", label: "Leaderboard", icon: FaTrophy },
  { href: "/achievements", label: "Achievements", icon: FaCrown },
  { href: "/store", label: "Store", icon: FaStore },
  { href: "/profile/user", label: "Profile", icon: FaUser },
  { href: "/settings", label: "Settings", icon: FaCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
      {/* Logo */}
      <div className="p-6 text-xl font-bold border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
  <span className="flex items-center gap-2">
    <img 
      src="/logo.png"
      alt="Coding Clash Logo"
      className="w-6 h-6 object-contain no-drag"
      draggable="false"
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click save
    />
    Coding Clash
  </span>
</div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname === href
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* User section and Logout */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2 py-2 rounded-lg bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
            {typeof window !== 'undefined' ? (localStorage.getItem('username')?.[0] || 'U') : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {typeof window !== 'undefined' ? localStorage.getItem('username') || 'User' : 'User'}
            </p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}