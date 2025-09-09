// components/DashboardLayout.tsx
'use client';

import { ReactNode } from "react";
import Sidebar from "./../components/SideBar";
// import Chatbox from "./../components/ChatBox";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        {/* <Chatbox /> */}
      </div>
    </SessionProvider>
  );
}