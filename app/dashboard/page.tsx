import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton"; // ✅ import client component
import Sidebar from "./components/SideBar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Welcome, {session.user?.username || session.user?.email}</h2>
      <p>Select a section from the sidebar to get started.</p>
    </div>
  );
}
