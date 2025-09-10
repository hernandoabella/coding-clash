import { NextResponse } from "next/server";
import { prisma } from "../../lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;

  const leaderboard = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: limit,
    select: {
      id: true,
      username: true,
      xp: true,
    },
  });

  const formatted = leaderboard.map((u, idx) => ({
    rank: idx + 1,
    name: u.username,
    score: u.xp,
  }));

  return NextResponse.json(formatted);
}
