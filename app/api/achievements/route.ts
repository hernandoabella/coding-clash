// app/api/achievements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

// Achievement definitions with conditions
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Win your first match',
    icon: '🩸',
    category: 'game' as const,
    rarity: 'common' as const,
    points: 10,
    condition: async (userId: string, stats: any) => {
      const wins = await prisma.gameSession.count({
        where: {
          userId,
          completed: true,
          score: { gte: 30 } // Consider score >= 30 as a win
        }
      });
      return wins >= 1;
    }
  },
  {
    id: 'code_master',
    title: 'Code Master',
    description: 'Answer 100 questions correctly',
    icon: '💻',
    category: 'skill' as const,
    rarity: 'rare' as const,
    points: 50,
    condition: async (userId: string, stats: any) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { correctAnswers: true }
      });
      return (user?.correctAnswers || 0) >= 100;
    }
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Add 10 friends',
    icon: '🦋',
    category: 'social' as const,
    rarity: 'rare' as const,
    points: 30,
    condition: async (userId: string, stats: any) => {
      // This would require a friends system implementation
      return false; // Placeholder
    }
  },
  {
    id: 'win_streak',
    title: 'Win Streak',
    description: 'Win 5 matches in a row',
    icon: '🔥',
    category: 'game' as const,
    rarity: 'epic' as const,
    points: 75,
    condition: async (userId: string, stats: any) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { maxStreak: true }
      });
      return (user?.maxStreak || 0) >= 5;
    }
  },
  {
    id: 'javascript_expert',
    title: 'JavaScript Expert',
    description: 'Master JavaScript questions with 90% accuracy',
    icon: '📜',
    category: 'skill' as const,
    rarity: 'epic' as const,
    points: 100,
    condition: async (userId: string, stats: any) => {
      const jsStats = await prisma.gameSession.groupBy({
        by: ['language'],
        where: {
          userId,
          language: 'JavaScript',
          completed: true
        },
        _avg: { accuracy: true }
      });
      return jsStats[0]?._avg.accuracy >= 90;
    }
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Answer 10 questions in under 5 seconds each',
    icon: '⚡',
    category: 'skill' as const,
    rarity: 'epic' as const,
    points: 85,
    condition: async (userId: string, stats: any) => {
      const fastAnswers = await prisma.userAnswer.count({
        where: {
          userId,
          timeSpent: { lte: 5 },
          isCorrect: true
        }
      });
      return fastAnswers >= 10;
    }
  },
  {
    id: 'game_champion',
    title: 'Game Champion',
    description: 'Reach the top 10 on the leaderboard',
    icon: '🏆',
    category: 'game' as const,
    rarity: 'legendary' as const,
    points: 200,
    condition: async (userId: string, stats: any) => {
      // This would require leaderboard calculation
      return false; // Placeholder
    }
  },
  {
    id: 'marathon_runner',
    title: 'Marathon Runner',
    description: 'Complete 50 quizzes',
    icon: '🏃',
    category: 'game' as const,
    rarity: 'epic' as const,
    points: 120,
    condition: async (userId: string, stats: any) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalGames: true }
      });
      return (user?.totalGames || 0) >= 50;
    }
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get a perfect score in any quiz',
    icon: '💯',
    category: 'skill' as const,
    rarity: 'rare' as const,
    points: 60,
    condition: async (userId: string, stats: any) => {
      const perfectGame = await prisma.gameSession.findFirst({
        where: {
          userId,
          completed: true,
          correctAnswers: { equals: prisma.gameSession.fields.totalQuestions }
        }
      });
      return !!perfectGame;
    }
  }
];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's unlocked achievements
    const unlockedAchievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    });

    // Get user stats for condition checking
    const userStats = await getUserStats(userId);

    // Check all achievements
    const achievements = await Promise.all(
      ACHIEVEMENT_DEFINITIONS.map(async (definition) => {
        const unlocked = unlockedAchievements.find(a => a.achievementType === definition.id);
        const isEarned = unlocked || await definition.condition(userId, userStats);

        // Auto-unlock if earned but not in database
        if (isEarned && !unlocked) {
          await prisma.achievement.create({
            data: {
              userId,
              achievementType: definition.id,
              unlockedAt: new Date()
            }
          });
        }

        // Calculate progress
        const progress = await calculateProgress(definition.id, userId, userStats);

        return {
          id: definition.id,
          title: definition.title,
          description: definition.description,
          icon: definition.icon,
          category: definition.category,
          rarity: definition.rarity,
          points: definition.points,
          progress: progress.current,
          totalRequired: progress.total,
          earned: isEarned,
          earnedDate: unlocked?.unlockedAt.toISOString().split('T')[0]
        };
      })
    );

    // Calculate statistics
    const earnedAchievements = achievements.filter(a => a.earned);
    const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);
    const completionPercentage = Math.round((earnedAchievements.length / achievements.length) * 100);

    return NextResponse.json({
      achievements,
      stats: {
        total: achievements.length,
        earned: earnedAchievements.length,
        points: totalPoints,
        completionPercentage,
        legendary: earnedAchievements.filter(a => a.rarity === 'legendary').length
      }
    });

  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserStats(userId: string) {
  const [
    user,
    gameStats,
    answerStats,
    languageStats
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        correctAnswers: true,
        totalGames: true,
        maxStreak: true,
        totalScore: true
      }
    }),
    prisma.gameSession.groupBy({
      by: ['language'],
      where: { userId, completed: true },
      _avg: { accuracy: true },
      _count: { id: true }
    }),
    prisma.userAnswer.groupBy({
      by: ['isCorrect'],
      where: { userId },
      _count: { id: true },
      _avg: { timeSpent: true }
    }),
    prisma.userAnswer.groupBy({
      by: ['questionId'],
      where: { userId, isCorrect: true, timeSpent: { lte: 5 } },
      _count: { id: true }
    })
  ]);

  return {
    user,
    gameStats,
    answerStats,
    languageStats,
    fastAnswers: languageStats.reduce((sum, stat) => sum + stat._count.id, 0)
  };
}

async function calculateProgress(achievementId: string, userId: string, stats: any) {
  switch (achievementId) {
    case 'first_blood':
      const wins = await prisma.gameSession.count({
        where: {
          userId,
          completed: true,
          score: { gte: 30 }
        }
      });
      return { current: Math.min(wins, 1), total: 1 };

    case 'code_master':
      return { current: stats.user?.correctAnswers || 0, total: 100 };

    case 'win_streak':
      return { current: Math.min(stats.user?.maxStreak || 0, 5), total: 5 };

    case 'javascript_expert':
      const jsAccuracy = stats.gameStats.find((g: any) => g.language === 'JavaScript')?._avg.accuracy || 0;
      return { current: Math.min(jsAccuracy, 90), total: 90 };

    case 'speed_demon':
      return { current: Math.min(stats.fastAnswers, 10), total: 10 };

    case 'marathon_runner':
      return { current: Math.min(stats.user?.totalGames || 0, 50), total: 50 };

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