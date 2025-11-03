'use client';

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "../components/SideBar";

interface LayoutProps {
  children: ReactNode;
}

export default function LeaderboardLayout({ children }: LayoutProps) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
