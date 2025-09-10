import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      xp: true,
      level: true,
      gamesPlayed: true,
      correctAnswers: true,
      totalAnswers: true,
      maxStreak: true,
      accuracy: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    ...user,
    rank: Math.floor(Math.random() * 100), // ⚡ luego puedes calcular ranking real
  });
}
