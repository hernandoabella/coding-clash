"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGamepad, FaChartBar, FaCog } from "react-icons/fa";
import ChatBox from "@/app/components/ChatBox";
import Sidebar from "../components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Play", icon: <FaGamepad />, href: "/dashboard/play" },
    { name: "Stats", icon: <FaChartBar />, href: "/dashboard/stats" },
    { name: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    
      <ChatBox />
    </div>
  );
}
