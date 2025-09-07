import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../components/SideBar";
import DashboardContent from "./components/DashboardContent"; // ✅ make sure you have this

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // ✅ fallback ensures username is always a string
  const username = session.user?.username || session.user?.email || "Guest";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <DashboardContent />
      </main>
    </div>
  );
}
