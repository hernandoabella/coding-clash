import { NextRequest, NextResponse } from "next/server";

// Mock de achievements
const mockAchievements = [
  {
    id: "achv_1",
    name: "First Victory",
    icon: "🏆",
    description: "Win your first game",
    earned: true
  },
  {
    id: "achv_2",
    name: "Winning Streak",
    icon: "🔥",
    description: "Win 5 games in a row",
    earned: false
  },
  {
    id: "achv_3",
    name: "Quiz Master",
    icon: "🎓",
    description: "Answer 100 questions correctly",
    earned: true
  },
  {
    id: "achv_4",
    name: "Unstoppable",
    icon: "💪",
    description: "Reach max streak of 10",
    earned: false
  }
];

export async function GET(req: NextRequest) {
  try {
    // Aquí podrías consultar tu DB real usando session.user.id
    // const userId = session.user.id;
    // const achievements = await db.achievements.findMany({ where: { userId } });

    return NextResponse.json(mockAchievements, { status: 200 });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
