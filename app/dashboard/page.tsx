import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";
import Sidebar from "./components/SideBar";
import DashboardContent from "./components/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Welcome, {session.user?.username || session.user?.email}
          </h2>
          <LogoutButton />
        </div>

        {/* Dashboard Main Content (game squares + chat) */}
        <DashboardContent username={session.user?.username || "You"} />
      </div>
    </div>
  );
}
