// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const timeframe = searchParams.get('timeframe') || 'all-time'; // all-time, weekly, daily
    const type = searchParams.get('type') || 'xp'; // xp, games, accuracy, streak

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    // Calculate date filters based on timeframe
    let dateFilter: { gte?: Date } = {};
    if (timeframe === 'weekly') {
      dateFilter.gte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'daily') {
      dateFilter.gte = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    let leaderboardQuery: any;
    
    switch (type) {
      case 'games':
        leaderboardQuery = await getGamesLeaderboard(limit, offset, dateFilter);
        break;
      case 'accuracy':
        leaderboardQuery = await getAccuracyLeaderboard(limit, offset, dateFilter);
        break;
      case 'streak':
        leaderboardQuery = await getStreakLeaderboard(limit, offset);
        break;
      case 'xp':
      default:
        leaderboardQuery = await getXPLeaderboard(limit, offset, dateFilter);
        break;
    }

    const { leaderboard, totalCount } = leaderboardQuery;

    // Get current user's position if they're not in the top list
    let currentUserPosition = null;
    if (currentUserId) {
      currentUserPosition = await getCurrentUserPosition(currentUserId, type, timeframe, dateFilter);
      
      // If current user is not in the leaderboard, add them
      if (currentUserPosition && !leaderboard.some((user: any) => user.id === currentUserId)) {
        const currentUserData = await getCurrentUserLeaderboardData(currentUserId, type, timeframe, dateFilter);
        if (currentUserData) {
          leaderboard.push({
            ...currentUserData,
            isCurrentUser: true,
            rank: currentUserPosition.rank
          });
        }
      }
    }

    // Mark current user in the leaderboard
    const leaderboardWithCurrentUser = leaderboard.map((user: any) => ({
      ...user,
      isCurrentUser: user.id === currentUserId
    }));

    return NextResponse.json({
      leaderboard: leaderboardWithCurrentUser,
      totalCount,
      currentUserPosition,
      timeframe,
      type
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get XP-based leaderboard
async function getXPLeaderboard(limit: number, offset: number, dateFilter: any) {
  const leaderboard = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      xp: true,
      level: true,
      gamesPlayed: true,
      correctAnswers: true,
      totalAnswers: true,
      accuracy: true,
      maxStreak: true,
      createdAt: true,
    },
    orderBy: { xp: 'desc' },
    skip: offset,
    take: limit,
  });

  const totalCount = await prisma.user.count();

  return {
    leaderboard: leaderboard.map((user, index) => ({
      ...user,
      rank: offset + index + 1,
      score: user.xp,
      metric: 'XP'
    })),
    totalCount
  };
}

// Get games played leaderboard
async function getGamesLeaderboard(limit: number, offset: number, dateFilter: any) {
  // For games leaderboard, we need to count games within the timeframe
  const usersWithGameCount = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      xp: true,
      level: true,
      gamesPlayed: true,
      correctAnswers: true,
      totalAnswers: true,
      accuracy: true,
      maxStreak: true,
      gameSessions: {
        where: {
          completed: true,
          createdAt: dateFilter.gte ? { gte: dateFilter.gte } : undefined
        },
        select: { id: true }
      }
    },
    orderBy: { gamesPlayed: 'desc' },
    skip: offset,
    take: limit,
  });

  const leaderboard = usersWithGameCount.map((user, index) => ({
    ...user,
    rank: offset + index + 1,
    score: user.gameSessions.length,
    metric: 'Games Played'
  }));

  const totalCount = await prisma.user.count({
    where: {
      gameSessions: dateFilter.gte ? {
        some: {
          completed: true,
          createdAt: { gte: dateFilter.gte }
        }
      } : {
        some: { completed: true }
      }
    }
  });

  return { leaderboard, totalCount };
}

// Get accuracy leaderboard
async function getAccuracyLeaderboard(limit: number, offset: number, dateFilter: any) {
  // Filter users with minimum games played
  const MIN_GAMES = 5;
  
  const users = await prisma.user.findMany({
    where: {
      gamesPlayed: { gte: MIN_GAMES },
      totalAnswers: { gt: 0 }
    },
    select: {
      id: true,
      username: true,
      xp: true,
      level: true,
      gamesPlayed: true,
      correctAnswers: true,
      totalAnswers: true,
      accuracy: true,
      maxStreak: true,
    },
    orderBy: { accuracy: 'desc' },
    skip: offset,
    take: limit,
  });

  const totalCount = await prisma.user.count({
    where: {
      gamesPlayed: { gte: MIN_GAMES },
      totalAnswers: { gt: 0 }
    }
  });

  return {
    leaderboard: users.map((user, index) => ({
      ...user,
      rank: offset + index + 1,
      score: user.accuracy,
      metric: 'Accuracy %'
    })),
    totalCount
  };
}

// Get streak leaderboard
async function getStreakLeaderboard(limit: number, offset: number) {
  const leaderboard = await prisma.user.findMany({
    where: {
      maxStreak: { gt: 0 }
    },
    select: {
      id: true,
      username: true,
      xp: true,
      level: true,
      gamesPlayed: true,
      correctAnswers: true,
      totalAnswers: true,
      accuracy: true,
      maxStreak: true,
    },
    orderBy: { maxStreak: 'desc' },
    skip: offset,
    take: limit,
  });

  const totalCount = await prisma.user.count({
    where: {
      maxStreak: { gt: 0 }
    }
  });

  return {
    leaderboard: leaderboard.map((user, index) => ({
      ...user,
      rank: offset + index + 1,
      score: user.maxStreak,
      metric: 'Max Streak'
    })),
    totalCount
  };
}

// Get current user's position in the leaderboard
async function getCurrentUserPosition(userId: string, type: string, timeframe: string, dateFilter: any) {
  let userCount = 0;

  switch (type) {
    case 'games':
      userCount = await prisma.user.count({
        where: {
          gameSessions: dateFilter.gte ? {
            some: {
              completed: true,
              createdAt: { gte: dateFilter.gte }
            }
          } : {
            some: { completed: true }
          },
          id: { not: userId }
        }
      });
      break;

    case 'accuracy':
      const MIN_GAMES = 5;
      userCount = await prisma.user.count({
        where: {
          gamesPlayed: { gte: MIN_GAMES },
          totalAnswers: { gt: 0 },
          accuracy: {
            gt: await prisma.user.findUnique({
              where: { id: userId },
              select: { accuracy: true }
            }).then(user => user?.accuracy || 0)
          }
        }
      });
      break;

    case 'streak':
      userCount = await prisma.user.count({
        where: {
          maxStreak: {
            gt: await prisma.user.findUnique({
              where: { id: userId },
              select: { maxStreak: true }
            }).then(user => user?.maxStreak || 0)
          }
        }
      });
      break;

    case 'xp':
    default:
      userCount = await prisma.user.count({
        where: {
          xp: {
            gt: await prisma.user.findUnique({
              where: { id: userId },
              select: { xp: true }
            }).then(user => user?.xp || 0)
          }
        }
      });
      break;
  }

  return {
    rank: userCount + 1,
    type,
    timeframe
  };
}

// Get current user's leaderboard data
async function getCurrentUserLeaderboardData(userId: string, type: string, timeframe: string, dateFilter: any) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      xp: true,
      level: true,
      gamesPlayed: true,
      correctAnswers: true,
      totalAnswers: true,
      accuracy: true,
      maxStreak: true,
    }
  });

  if (!user) return null;

  let score = 0;
  let metric = '';

  switch (type) {
    case 'games':
      const gameCount = await prisma.gameSession.count({
        where: {
          userId,
          completed: true,
          createdAt: dateFilter.gte ? { gte: dateFilter.gte } : undefined
        }
      });
      score = gameCount;
      metric = 'Games Played';
      break;

    case 'accuracy':
      score = user.accuracy;
      metric = 'Accuracy %';
      break;

    case 'streak':
      score = user.maxStreak;
      metric = 'Max Streak';
      break;

    case 'xp':
    default:
      score = user.xp;
      metric = 'XP';
      break;
  }

  return {
    ...user,
    score,
    metric
  };
}

// Optional: POST endpoint to update leaderboard cache (for performance)
export async function POST(req: NextRequest) {
  try {
    // This could be used to refresh leaderboard cache periodically
    // For now, we'll just return the current leaderboard
    return GET(req);
  } catch (error) {
    console.error('Error updating leaderboard cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}