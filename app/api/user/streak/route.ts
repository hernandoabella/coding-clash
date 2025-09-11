import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data with calculated stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: {
        gameSessions: {
          where: { completed: true },
          orderBy: { startTime: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate win rate (accuracy as win rate for quiz games)
    const winRate = user.totalAnswers > 0 ? 
      (user.correctAnswers / user.totalAnswers) : 0;

    // Calculate accuracy percentage
    const accuracy = user.totalAnswers > 0 ? 
      (user.correctAnswers / user.totalAnswers) : 0;

    // Get user rank (simplified ranking by XP)
    const usersWithHigherXP = await prisma.user.count({
      where: {
        xp: {
          gt: user.xp
        }
      }
    });
    const rank = usersWithHigherXP + 1;

    // Calculate level based on XP (every 1000 XP = 1 level)
    const level = Math.floor(user.xp / 1000) + 1;

    const stats = {
      id: user.id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level,
      rank,
      gamesPlayed: user.gamesPlayed,
      correctAnswers: user.correctAnswers,
      totalAnswers: user.totalAnswers,
      maxStreak: user.maxStreak,
      currentStreak: user.currentStreak,
      winRate,
      accuracy,
      createdAt: user.createdAt,
      // Additional computed stats
      completedGames: user.gameSessions.length,
      averageScore: user.gameSessions.length > 0 ? 
        user.gameSessions.reduce((acc, game) => acc + game.score, 0) / user.gameSessions.length : 0,
      totalTimeSpent: user.gameSessions.reduce((acc, game) => acc + game.timeSpent, 0),
    };

    // Update user level if it changed
    if (level !== user.level) {
      await prisma.user.update({
        where: { id: user.id },
        data: { level }
      });
    }

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}