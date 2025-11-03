'use client';

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "./../components/SideBar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
