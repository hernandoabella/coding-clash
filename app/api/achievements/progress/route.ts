// app/api/achievements/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const achievementType = searchParams.get('type');

    if (!achievementType) {
      return NextResponse.json(
        { error: 'Achievement type is required' },
        { status: 400 }
      );
    }

    const progress = await calculateAchievementProgress(session.user.id, achievementType);

    return NextResponse.json({ progress });

  } catch (error) {
    console.error('Error checking achievement progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function calculateAchievementProgress(userId: string, achievementType: string) {
  switch (achievementType) {
    case 'code_master':
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { correctAnswers: true }
      });
      return { current: user?.correctAnswers || 0, total: 100 };

    case 'win_streak':
      const userWithStreak = await prisma.user.findUnique({
        where: { id: userId },
        select: { maxStreak: true }
      });
      return { current: userWithStreak?.maxStreak || 0, total: 5 };

    case 'marathon_runner':
      const userGames = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalGames: true }
      });
      return { current: userGames?.totalGames || 0, total: 50 };

    case 'speed_demon':
      const fastAnswers = await prisma.userAnswer.count({
        where: {
          userId,
          timeSpent: { lte: 5 },
          isCorrect: true
        }
      });
      return { current: fastAnswers, total: 10 };

    case 'perfect_score':
      const perfectGames = await prisma.gameSession.count({
        where: {
          userId,
          completed: true,
          correctAnswers: { equals: prisma.gameSession.fields.totalQuestions }
        }
      });
      return { current: Math.min(perfectGames, 1), total: 1 };

    default:
      return { current: 0, total: 1 };
  }
}