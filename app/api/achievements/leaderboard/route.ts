// app/api/achievements/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
        achievements: {
          select: {
            achievementType: true,
            unlockedAt: true
          }
        }
      },
      orderBy: { xp: 'desc' },
      take: limit
    });

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      xp: user.xp,
      level: user.level,
      achievements: user.achievements.length,
      legendary: user.achievements.filter(a => 
        ['game_champion', 'javascript_expert'].includes(a.achievementType)
      ).length
    }));

    return NextResponse.json({ leaderboard: formattedLeaderboard });

  } catch (error) {
    console.error('Error fetching achievement leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}