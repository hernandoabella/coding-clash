import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const achievements = await prisma.achievement.findMany({
    take: 10,
    
  });

  return NextResponse.json(achievements);
}
