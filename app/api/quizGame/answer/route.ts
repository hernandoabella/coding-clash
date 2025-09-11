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

    const { sessionId, questionId, selectedAnswer, timeSpent } = await request.json();

    if (!sessionId || !questionId || !selectedAnswer) {
      return NextResponse.json(
        { error: "Session ID, question ID, and selected answer are required" },
        { status: 400 }
      );
    }

    // Verify game session
    const gameSession = await prisma.gameSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
        status: "ACTIVE"
      }
    });

    if (!gameSession) {
      return NextResponse.json(
        { error: "Game session not found or inactive" },
        { status: 404 }
      );
    }

    // Get the question to check correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Get current streak
    const currentStreak = isCorrect ? gameSession.maxStreak + 1 : 0;

    // Save user's answer
    const userAnswer = await prisma.userAnswer.create({
      data: {
        userId: session.user.id,
        sessionId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent: timeSpent || 0,
        streakAtAnswer: currentStreak,
      },
    });

    // Update game session stats
    await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        totalQuestions: { increment: 1 },
        correctAnswers: isCorrect ? { increment: 1 } : undefined,
        maxStreak: currentStreak > gameSession.maxStreak ? currentStreak : undefined,
        score: { 
          increment: isCorrect ? 
            (gameSession.difficulty === "Easy" ? 5 : 
             gameSession.difficulty === "Medium" ? 10 : 15) : 0
        }
      },
    });

    // Calculate XP earned (base points + streak bonus)
    const baseXP = isCorrect ? 
      (gameSession.difficulty === "Easy" ? 5 : 
       gameSession.difficulty === "Medium" ? 10 : 15) : 0;
    
    const streakBonus = Math.min(currentStreak * 2, 50); // Max 50 bonus
    const xpEarned = baseXP + streakBonus;

    // Update user stats if answer is correct
    if (isCorrect && xpEarned > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          xp: { increment: xpEarned },
          correctAnswers: { increment: 1 },
          totalAnswers: { increment: 1 },
          currentStreak: currentStreak,
          maxStreak: currentStreak > gameSession.maxStreak ? currentStreak : undefined,
        },
      });
    } else {
      // Still increment total answers even if wrong
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalAnswers: { increment: 1 },
          currentStreak: 0, // Reset streak on wrong answer
        },
      });
    }

    return NextResponse.json({
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      xpEarned,
      currentStreak,
      userAnswerId: userAnswer.id,
    });
    
  } catch (error) {
    console.error("Error processing answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}