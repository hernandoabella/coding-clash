// components/DashboardLayout.tsx
import { ReactNode } from "react";
import Sidebar from "./../components/SideBar";
import Chatbox from "./../components/ChatBox";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <Chatbox />
    </div>
  );
}