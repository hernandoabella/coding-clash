// app/api/user/achievements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

// Define achievement types and their requirements
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_game',
    name: 'First Blood',
    icon: '🩸',
    description: 'Complete your first game',
    condition: (user: any, stats: any) => user.gamesPlayed >= 1,
  },
  {
    id: 'perfect_game',
    name: 'Perfect Score',
    icon: '⭐',
    description: 'Get a perfect score in any game',
    condition: (user: any, stats: any) => stats.perfectGames > 0,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    icon: '🔥',
    description: 'Achieve a 10-question streak',
    condition: (user: any, stats: any) => user.maxStreak >= 10,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Answer 10 questions in under 5 seconds each',
    condition: (user: any, stats: any) => stats.fastAnswers >= 10,
  },
  {
    id: 'language_master',
    name: 'Language Master',
    icon: '🌐',
    description: 'Master all questions in a programming language',
    condition: (user: any, stats: any) => Object.values(stats.languageMastery).some((mastery: any) => mastery >= 90),
  },
  {
    id: 'daily_challenge',
    name: 'Daily Challenger',
    icon: '📅',
    description: 'Complete 7 daily challenges',
    condition: (user: any, stats: any) => stats.dailyChallengesCompleted >= 7,
  },
  {
    id: 'weekly_streak',
    name: 'Weekly Warrior',
    icon: '🏆',
    description: 'Play for 7 consecutive days',
    condition: (user: any, stats: any) => stats.consecutiveDays >= 7,
  },
  {
    id: 'code_wizard',
    name: 'Code Wizard',
    icon: '🧙',
    description: 'Answer 100 questions correctly',
    condition: (user: any, stats: any) => user.correctAnswers >= 100,
  },
  {
    id: 'quiz_marathon',
    name: 'Quiz Marathon',
    icon: '🏃',
    description: 'Complete 25 games',
    condition: (user: any, stats: any) => user.gamesPlayed >= 25,
  },
  {
    id: 'accuracy_expert',
    name: 'Accuracy Expert',
    icon: '🎯',
    description: 'Maintain 90%+ accuracy across 10 games',
    condition: (user: any, stats: any) => stats.highAccuracyGames >= 10,
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's unlocked achievements from database
    const unlockedAchievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });

    // Get user stats for achievement condition checking
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gamesPlayed: true,
        correctAnswers: true,
        totalAnswers: true,
        maxStreak: true,
        xp: true,
        level: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get additional stats for achievement conditions
    const additionalStats = await calculateAdditionalStats(userId);

    // Check which achievements the user has earned
    const allAchievements = ACHIEVEMENT_DEFINITIONS.map(achievementDef => {
      const unlocked = unlockedAchievements.find(a => a.achievementType === achievementDef.id);
      const isEarned = unlocked || achievementDef.condition(user, additionalStats);
      
      // If earned but not yet unlocked in database, create the achievement record
      if (isEarned && !unlocked) {
        // We'll create the achievement async (don't await to avoid blocking the response)
        prisma.achievement.create({
          data: {
            userId,
            achievementType: achievementDef.id,
            progress: calculateProgress(achievementDef.id, user, additionalStats),
          }
        }).catch(console.error);
      }

      return {
        id: achievementDef.id,
        name: achievementDef.name,
        icon: achievementDef.icon,
        description: achievementDef.description,
        earned: isEarned,
        unlockedAt: unlocked?.unlockedAt || null,
        progress: calculateProgress(achievementDef.id, user, additionalStats),
      };
    });

    // Separate earned and unearned achievements
    const earnedAchievements = allAchievements.filter(a => a.earned);
    const unearnedAchievements = allAchievements.filter(a => !a.earned);

    // Return both lists, with earned ones first
    return NextResponse.json([...earnedAchievements, ...unearnedAchievements]);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate additional stats for achievement conditions
async function calculateAdditionalStats(userId: string) {
  const [
    perfectGames,
    fastAnswers,
    languageStats,
    dailyChallenges,
    consecutiveDays,
    highAccuracyGames
  ] = await Promise.all([
    // Perfect games (score = totalQuestions * points per question)
    prisma.gameSession.count({
      where: {
        userId,
        completed: true,
        score: {
          equals: prisma.gameSession.fields.totalQuestions * 10 // Assuming 10 points per question
        }
      }
    }),

    // Fast answers (under 5 seconds)
    prisma.userAnswer.count({
      where: {
        userId,
        timeSpent: { lte: 5 }, // 5 seconds or less
        isCorrect: true
      }
    }),

    // Language mastery (accuracy per language)
    prisma.gameSession.groupBy({
      by: ['language'],
      where: { userId, completed: true },
      _avg: { accuracy: true },
      _count: { id: true }
    }),

    // Daily challenges completed
    prisma.gameSession.count({
      where: {
        userId,
        completed: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    }),

    // Consecutive days (simplified - last 7 days with activity)
    calculateConsecutiveDays(userId),

    // High accuracy games (90%+ accuracy)
    prisma.gameSession.count({
      where: {
        userId,
        completed: true,
        accuracy: { gte: 90 }
      }
    })
  ]);

  const languageMastery = languageStats.reduce((acc, stat) => {
    acc[stat.language] = stat._avg.accuracy || 0;
    return acc;
  }, {} as Record<string, number>);

  return {
    perfectGames,
    fastAnswers,
    languageMastery,
    dailyChallengesCompleted: dailyChallenges,
    consecutiveDays,
    highAccuracyGames
  };
}

// Helper to calculate consecutive days with activity
async function calculateConsecutiveDays(userId: string): Promise<number> {
  const last7Days = await prisma.gameSession.findMany({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' }
  });

  // Get unique days with activity
  const activeDays = new Set(
    last7Days.map(session => session.createdAt.toISOString().split('T')[0])
  );

  // Calculate consecutive days (simplified)
  const dates = Array.from(activeDays).sort();
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  let previousDate: string | null = null;

  for (const date of dates) {
    if (!previousDate) {
      currentConsecutive = 1;
    } else {
      const prev = new Date(previousDate);
      const current = new Date(date);
      const diffDays = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentConsecutive++;
      } else {
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        currentConsecutive = 1;
      }
    }
    previousDate = date;
  }

  return Math.max(maxConsecutive, currentConsecutive);
}

// Helper to calculate progress for each achievement
function calculateProgress(achievementId: string, user: any, stats: any): number {
  switch (achievementId) {
    case 'first_game':
      return user.gamesPlayed >= 1 ? 100 : 0;
    
    case 'perfect_game':
      return Math.min((stats.perfectGames / 1) * 100, 100);
    
    case 'streak_master':
      return Math.min((user.maxStreak / 10) * 100, 100);
    
    case 'speed_demon':
      return Math.min((stats.fastAnswers / 10) * 100, 100);
    
    case 'language_master':
      const maxMastery = Math.max(...Object.values(stats.languageMastery as number[]));
      return Math.min((maxMastery / 90) * 100, 100);
    
    case 'daily_challenge':
      return Math.min((stats.dailyChallengesCompleted / 7) * 100, 100);
    
    case 'weekly_streak':
      return Math.min((stats.consecutiveDays / 7) * 100, 100);
    
    case 'code_wizard':
      return Math.min((user.correctAnswers / 100) * 100, 100);
    
    case 'quiz_marathon':
      return Math.min((user.gamesPlayed / 25) * 100, 100);
    
    case 'accuracy_expert':
      return Math.min((stats.highAccuracyGames / 10) * 100, 100);
    
    default:
      return 0;
  }
}