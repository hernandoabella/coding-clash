// app/api/quizGame/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate required parameters
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!language || !difficulty) {
      return NextResponse.json(
        { error: "Language and difficulty are required" },
        { status: 400 }
      );
    }

    // Verify the game session exists and belongs to the user
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

    // Get questions for the language and difficulty
    const questions = await prisma.question.findMany({
      where: {
        language: language.toLowerCase(),
        difficulty: difficulty.toLowerCase(),
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { 
          error: "No questions found for this language and difficulty",
          questions: [] 
        },
        { status: 200 } // Return 200 with empty array instead of 404
      );
    }

    // Format questions for frontend (don't send correct answer)
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      category: q.category,
      explanation: q.explanation,
      
    }));

    return NextResponse.json({
      questions: formattedQuestions,
      sessionId: gameSession.id,
      totalQuestions: questions.length
    });
    
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}