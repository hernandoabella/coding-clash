"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGamepad, FaChartBar, FaCog } from "react-icons/fa";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Play", icon: <FaGamepad />, href: "/dashboard/play" },
    { name: "Stats", icon: <FaChartBar />, href: "/dashboard/stats" },
    { name: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-lg flex flex-col">
        <h1 className="text-2xl font-bold p-6 border-b">Coding Clash</h1>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 p-3 rounded cursor-pointer ${
                  pathname === item.href ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
