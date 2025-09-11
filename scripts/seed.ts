import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, completed, finalScore } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get the current game session
    const gameSession = await prisma.gameSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      include: {
        userAnswers: true,
      }
    });

    if (!gameSession) {
      return NextResponse.json(
        { error: "Game session not found" },
        { status: 404 }
      );
    }

    // Calculate final stats
    const totalQuestions = gameSession.userAnswers.length;
    const correctAnswers = gameSession.userAnswers.filter(answer => answer.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) : 0;
    const timeSpent = Math.floor((new Date().getTime() - gameSession.startTime.getTime()) / 1000);

    // Calculate XP earned during the session
    const xpFromAnswers = gameSession.userAnswers
      .filter(answer => answer.isCorrect)
      .reduce((total, answer) => {
        const baseXP = gameSession.difficulty === "Easy" ? 5 : 
                     gameSession.difficulty === "Medium" ? 10 : 15;
        const streakBonus = Math.min(answer.streakAtAnswer * 2, 50);
        return total + baseXP + streakBonus;
      }, 0);

    // Update the game session
    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        completed: completed || false,
        endTime: new Date(),
        totalQuestions,
        correctAnswers,
        accuracy,
        timeSpent,
        xpEarned: completed ? xpFromAnswers : 0, // No XP if game was abandoned
        status: completed ? "COMPLETED" : "ABANDONED",
        score: completed ? finalScore || gameSession.score : 0,
      },
    });

    // Update user stats only if game was completed
    if (completed) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          gamesPlayed: { increment: 1 },
          // XP and other stats were already updated in the answer endpoint
        },
      });

      // Create daily activity record
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyActivity.upsert({
        where: {
          userId_activityDate: {
            userId: session.user.id,
            activityDate: today,
          }
        },
        update: {
          activityCount: { increment: 1 },
          totalXp: { increment: xpFromAnswers },
          lastActivityAt: new Date(),
        },
        create: {
          userId: session.user.id,
          activityType: "QUIZ_COMPLETED",
          activityDate: today,
          activityCount: 1,
          totalXp: xpFromAnswers,
          gameSessionId: sessionId,
        },
      });

      // Check for achievements
      await checkAndUnlockAchievements(session.user.id, {
        gameCompleted: true,
        perfectGame: accuracy === 1.0,
        currentStreak: gameSession.maxStreak,
        totalGamesPlayed: await getUserGamesCount(session.user.id) + 1,
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: updatedSession.id,
      completed: updatedSession.completed,
      finalStats: {
        score: updatedSession.score,
        correctAnswers: updatedSession.correctAnswers,
        totalQuestions: updatedSession.totalQuestions,
        accuracy: Math.round(updatedSession.accuracy * 100),
        timeSpent: updatedSession.timeSpent,
        xpEarned: updatedSession.xpEarned,
        maxStreak: updatedSession.maxStreak,
      },
    });
    
  } catch (error) {
    console.error("Error ending game session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to get user's total games count
async function getUserGamesCount(userId: string): Promise<number> {
  return await prisma.gameSession.count({
    where: {
      userId,
      completed: true,
    }
  });
}

// Helper function to check and unlock achievements
async function checkAndUnlockAchievements(userId: string, gameData: {
  gameCompleted: boolean;
  perfectGame: boolean;
  currentStreak: number;
  totalGamesPlayed: number;
}) {
  try {
    const achievementsToUnlock = [];

    // First Game Achievement
    if (gameData.totalGamesPlayed === 1) {
      achievementsToUnlock.push({
        userId,
        achievementType: "FIRST_GAME" as const,
      });
    }

    // Perfect Game Achievement
    if (gameData.perfectGame) {
      achievementsToUnlock.push({
        userId,
        achievementType: "PERFECT_GAME" as const,
      });
    }

    // Streak Master Achievement (streak of 5+)
    if (gameData.currentStreak >= 5) {
      achievementsToUnlock.push({
        userId,
        achievementType: "STREAK_MASTER" as const,
        progress: gameData.currentStreak,
      });
    }

    // Create achievements (ignore duplicates)
    for (const achievement of achievementsToUnlock) {
      try {
        await prisma.achievement.create({
          data: achievement,
        });
        
        // Create notification for new achievement
        await prisma.notification.create({
          data: {
            userId,
            type: "ACHIEVEMENT_UNLOCKED",
            data: {
              achievementType: achievement.achievementType,
              title: getAchievementTitle(achievement.achievementType),
              description: getAchievementDescription(achievement.achievementType),
            },
            priority: 2,
          },
        });
      } catch (error) {
        // Achievement already exists, skip
        continue;
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

function getAchievementTitle(type: string): string {
  switch (type) {
    case "FIRST_GAME":
      return "Welcome Warrior!";
    case "PERFECT_GAME":
      return "Perfect Score!";
    case "STREAK_MASTER":
      return "Streak Master!";
    default:
      return "Achievement Unlocked!";
  }
}

function getAchievementDescription(type: string): string {
  switch (type) {
    case "FIRST_GAME":
      return "You completed your first quiz game!";
    case "PERFECT_GAME":
      return "You answered all questions correctly!";
    case "STREAK_MASTER":
      return "You achieved a streak of 5 or more!";
    default:
      return "You unlocked a new achievement!";
  }
}