import { NextRequest, NextResponse } from "next/server";

// Mock de juegos recientes
const mockGames = [
  { id: "1", score: 120, correctAnswers: 8, totalQuestions: 10, language: "JavaScript", difficulty: "Medium", completed: true, createdAt: "2025-09-06T12:30:00Z" },
  { id: "2", score: 95, correctAnswers: 7, totalQuestions: 10, language: "Python", difficulty: "Easy", completed: true, createdAt: "2025-09-05T16:45:00Z" },
  { id: "3", score: 150, correctAnswers: 10, totalQuestions: 10, language: "C++", difficulty: "Hard", completed: true, createdAt: "2025-09-04T14:10:00Z" },
  { id: "4", score: 80, correctAnswers: 6, totalQuestions: 10, language: "Java", difficulty: "Medium", completed: false, createdAt: "2025-09-03T10:20:00Z" },
  { id: "5", score: 110, correctAnswers: 9, totalQuestions: 10, language: "TypeScript", difficulty: "Medium", completed: true, createdAt: "2025-09-02T18:00:00Z" },
  { id: "6", score: 70, correctAnswers: 5, totalQuestions: 10, language: "Ruby", difficulty: "Easy", completed: false, createdAt: "2025-09-01T11:15:00Z" },
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 5;

    // Devolver los últimos `limit` juegos
    const recentGames = mockGames.slice(0, limit);

    return NextResponse.json(recentGames, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent games:", error);
    return NextResponse.json({ error: "Failed to fetch recent games" }, { status: 500 });
  }
}
