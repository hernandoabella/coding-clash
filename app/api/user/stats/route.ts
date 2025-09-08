// app/api/user/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Obtener sesión
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Traer estadísticas del usuario desde la DB
    const userStats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        level: true,
        xp: true,
        gamesPlayed: true,
        correctAnswers: true,
        totalAnswers: true,
        maxStreak: true,
        accuracy: true,
        winRate: true, // Asegúrate que está en tu modelo Prisma
      },
    });

    if (!userStats) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calcular winRate si no está definido
    const computedWinRate =
      userStats.gamesPlayed > 0
        ? Math.round((userStats.correctAnswers / userStats.gamesPlayed) * 100)
        : 0;

    // Calcular rank dinámicamente según XP
    const rank = await prisma.user.count({
      where: {
        xp: { gt: userStats.xp },
      },
    }) + 1;

    return NextResponse.json({
      id: userStats.id,
      username: userStats.username,
      level: userStats.level,
      xp: userStats.xp,
      gamesPlayed: userStats.gamesPlayed,
      correctAnswers: userStats.correctAnswers,
      totalAnswers: userStats.totalAnswers,
      maxStreak: userStats.maxStreak,
      accuracy: userStats.accuracy,
      winRate: userStats.winRate || computedWinRate,
      rank,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
