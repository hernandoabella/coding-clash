// app/api/achievements/unlock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { achievementType } = await req.json();

    if (!achievementType) {
      return NextResponse.json(
        { error: 'Achievement type is required' },
        { status: 400 }
      );
    }

    // Check if already unlocked
    const existing = await prisma.achievement.findFirst({
      where: {
        userId: session.user.id,
        achievementType
      }
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Achievement already unlocked',
        achievement: existing
      });
    }

    // Unlock achievement
    const achievement = await prisma.achievement.create({
      data: {
        userId: session.user.id,
        achievementType,
        unlockedAt: new Date()
      }
    });

    // Add achievement points to user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        xp: { increment: getAchievementPoints(achievementType) }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Achievement unlocked!',
      achievement
    });

  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getAchievementPoints(achievementType: string): number {
  const pointsMap: Record<string, number> = {
    'first_blood': 10,
    'code_master': 50,
    'social_butterfly': 30,
    'win_streak': 75,
    'javascript_expert': 100,
    'speed_demon': 85,
    'game_champion': 200,
    'marathon_runner': 120,
    'perfect_score': 60
  };
  return pointsMap[achievementType] || 0;
}