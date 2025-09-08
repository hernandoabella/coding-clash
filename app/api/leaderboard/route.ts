import { NextRequest, NextResponse } from "next/server";

// Mock de leaderboard
const mockLeaderboard = [
  { rank: 1, name: "Alice", score: 9800, isCurrentUser: false },
  { rank: 2, name: "Bob", score: 8700, isCurrentUser: false },
  { rank: 3, name: "Charlie", score: 8200, isCurrentUser: false },
  { rank: 4, name: "Hernando", score: 7900, isCurrentUser: true },
  { rank: 5, name: "Eve", score: 7600, isCurrentUser: false },
  { rank: 6, name: "Frank", score: 7200, isCurrentUser: false },
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 5;

    // Devolver los top `limit` jugadores
    const leaderboardData = mockLeaderboard.slice(0, limit);

    return NextResponse.json(leaderboardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
