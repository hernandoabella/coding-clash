import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 5;

  try {
    const games = await prisma.gameSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startTime: "desc" }, // ✅ use startTime instead
      take: limit,
      select: {
        id: true,
        score: true,
        correctAnswers: true,
        totalQuestions: true,
        language: true,
        difficulty: true,
        completed: true,
        startTime: true, // ✅ changed here too
        xpEarned: true,
        timeSpent: true,
        accuracy: true,
      },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching user games:", error);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
