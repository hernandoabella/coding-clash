import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        achievements: true,
        gameSessions: {
          orderBy: { startTime: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // optional: calculate rank, winrate, etc.
    const totalGames = user.gamesPlayed || user.gameSessions.length;
    const winRate =
      totalGames > 0 ? (user.correctAnswers / user.totalAnswers) * 100 : 0;

    return NextResponse.json({
      id: user.id,
      username: user.username,
      xp: user.xp,
      level: user.level,
      winRate,
      streak: user.currentStreak,
      achievements: user.achievements,
      recentGames: user.gameSessions,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
