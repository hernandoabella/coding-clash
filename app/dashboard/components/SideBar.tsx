"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaGamepad } from "react-icons/fa";

const navItems = [
  { href: "/dashboard", label: "Game", icon: FaGamepad },
  { href: "/dashboard/profile", label: "Profile", icon: FaUser },
  { href: "/dashboard/settings", label: "Settings", icon: FaCog },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white text-gray-900 border-r shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-4 text-xl font-bold border-b border-gray-200">
        Coding Clash
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              pathname === href
                ? "bg-blue-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-red-100 transition"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
