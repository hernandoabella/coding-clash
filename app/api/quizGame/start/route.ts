import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { language, difficulty, weapon } = await request.json();

    if (!language || !difficulty) {
      return NextResponse.json(
        { error: "Language and difficulty are required" },
        { status: 400 }
      );
    }

    // Ensure we have the user ID as string
    const userId = session.user.id as string;

    // Create a new game session
    const gameSession = await prisma.gameSession.create({
      data: {
        userId,
        language: language as string,
        difficulty: difficulty as string,
        weaponUsed: weapon as string || null,
        status: "ACTIVE",
        startTime: new Date(),
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        maxStreak: 0,
        accuracy: 0,
        timeSpent: 0,
        xpEarned: 0,
        completed: false,
      },
    });

    return NextResponse.json({
      sessionId: gameSession.id,
      message: "Game session started successfully",
    });
    
  } catch (error) {
    console.error("Error starting game session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}