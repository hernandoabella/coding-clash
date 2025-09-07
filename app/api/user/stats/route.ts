// app/api/user/streak/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const includeHistory = searchParams.get('includeHistory') === 'true';
    const includeStats = searchParams.get('includeStats') !== 'false';

    // Get user's current streak and daily activity
    const streakData = await calculateUserStreak(userId);

    // Prepare response
    const response: any = {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      lastActivityDate: streakData.lastActivityDate,
      timezone: streakData.timezone,
      maintainable: streakData.maintainable,
      nextResetTime: streakData.nextResetTime,
      streakStatus: streakData.streakStatus
    };

    // Include history if requested
    if (includeHistory) {
      response.activityHistory = await getActivityHistory(userId, 30); // Last 30 days
    }

    // Include additional stats if requested
    if (includeStats) {
      response.stats = await getStreakStats(userId, streakData);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update streak (called when user completes an activity)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { activityType, xpEarned, gameSessionId } = await req.json();

    // Record the activity and update streak
    const result = await recordDailyActivity(userId, activityType, xpEarned, gameSessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating user streak:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate user's current streak
async function calculateUserStreak(userId: string) {
  // Get user's timezone preference (default to UTC)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true, longestStreak: true }
  });

  const timezone = user?.timezone || 'UTC';
  const userLongestStreak = user?.longestStreak || 0;

  // Get user's daily activities
  const activities = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { activityDate: 'desc' },
    take: 30 // Only check last 30 days for performance
  });

  if (activities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: userLongestStreak,
      lastActivityDate: null,
      timezone,
      maintainable: true,
      nextResetTime: getNextResetTime(timezone),
      streakStatus: 'inactive'
    };
  }

  // Sort activities by date (newest first)
  const sortedActivities = activities.sort((a, b) => 
    new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
  );

  const today = getCurrentDate(timezone);
  const yesterday = getPreviousDate(today);
  
  const lastActivityDate = new Date(sortedActivities[0].activityDate);
  const lastActivityFormatted = formatDate(lastActivityDate, timezone);

  // Check if user was active today
  const activeToday = sortedActivities.some(activity => 
    isSameDate(activity.activityDate, today, timezone)
  );

  // Check if user was active yesterday
  const activeYesterday = sortedActivities.some(activity => 
    isSameDate(activity.activityDate, yesterday, timezone)
  );

  // Calculate current streak
  let currentStreak = 0;
  let maintainable = true;
  let streakStatus: 'active' | 'broken' | 'maintainable' | 'inactive' = 'inactive';

  if (activeToday) {
    currentStreak = await calculateConsecutiveDays(sortedActivities, timezone);
    streakStatus = 'active';
  } else if (activeYesterday) {
    // User was active yesterday but not today yet - streak is maintainable
    currentStreak = await calculateConsecutiveDays(
      sortedActivities.filter(a => !isSameDate(a.activityDate, today, timezone)),
      timezone
    );
    maintainable = true;
    streakStatus = 'maintainable';
  } else {
    // Check if streak is broken (missed a day)
    const daysSinceLastActivity = getDaysDifference(today, lastActivityFormatted, timezone);
    if (daysSinceLastActivity > 1) {
      currentStreak = 0;
      maintainable = false;
      streakStatus = 'broken';
    } else {
      // Still within the same day for streak purposes
      currentStreak = await calculateConsecutiveDays(sortedActivities, timezone);
      maintainable = true;
      streakStatus = 'maintainable';
    }
  }

  // Update longest streak if current is higher
  const longestStreak = Math.max(userLongestStreak, currentStreak);
  if (longestStreak > userLongestStreak) {
    await prisma.user.update({
      where: { id: userId },
      data: { longestStreak }
    });
  }

  return {
    currentStreak,
    longestStreak,
    lastActivityDate: lastActivityFormatted,
    timezone,
    maintainable,
    nextResetTime: getNextResetTime(timezone),
    streakStatus
  };
}

// Record daily activity and update streak
async function recordDailyActivity(userId: string, activityType: string, xpEarned: number = 0, gameSessionId?: string) {
  const timezone = 'UTC'; // Default, could be user-specific
  const today = getCurrentDate(timezone);

  // Check if already recorded activity today
  const existingActivity = await prisma.dailyActivity.findFirst({
    where: {
      userId,
      activityDate: {
        gte: new Date(today + 'T00:00:00.000Z'),
        lte: new Date(today + 'T23:59:59.999Z')
      }
    }
  });

  if (existingActivity) {
    // Update existing activity
    const updatedActivity = await prisma.dailyActivity.update({
      where: { id: existingActivity.id },
      data: {
        activityCount: existingActivity.activityCount + 1,
        totalXp: existingActivity.totalXp + xpEarned,
        lastActivityAt: new Date()
      }
    });

    return {
      success: true,
      activity: updatedActivity,
      isNew: false
    };
  }

  // Create new activity record
  const newActivity = await prisma.dailyActivity.create({
    data: {
      userId,
      activityType,
      activityDate: new Date(today + 'T00:00:00.000Z'),
      activityCount: 1,
      totalXp: xpEarned,
      gameSessionId,
      timezone
    }
  });

  // Calculate new streak
  const streakData = await calculateUserStreak(userId);

  return {
    success: true,
    activity: newActivity,
    isNew: true,
    streakData
  };
}

// Get activity history
async function getActivityHistory(userId: string, days: number = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activities = await prisma.dailyActivity.findMany({
    where: {
      userId,
      activityDate: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { activityDate: 'desc' },
    include: {
      gameSession: {
        select: {
          language: true,
          difficulty: true,
          score: true
        }
      }
    }
  });

  // Create a map of all dates in the range
  const dateMap = new Map();
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = formatDate(currentDate, 'UTC');
    dateMap.set(dateKey, {
      date: dateKey,
      active: false,
      activityCount: 0,
      totalXp: 0,
      activities: []
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in actual activities
  activities.forEach(activity => {
    const dateKey = formatDate(activity.activityDate, 'UTC');
    if (dateMap.has(dateKey)) {
      dateMap.get(dateKey).active = true;
      dateMap.get(dateKey).activityCount = activity.activityCount;
      dateMap.get(dateKey).totalXp = activity.totalXp;
      dateMap.get(dateKey).activities.push({
        type: activity.activityType,
        xp: activity.totalXp,
        gameSession: activity.gameSession
      });
    }
  });

  return Array.from(dateMap.values()).reverse(); // Return in chronological order
}

// Get streak statistics
async function getStreakStats(userId: string, streakData: any) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalActivities,
    totalXp,
    activeDays,
    bestDay,
    consistency
  ] = await Promise.all([
    // Total activities in last 30 days
    prisma.dailyActivity.aggregate({
      where: {
        userId,
        activityDate: { gte: thirtyDaysAgo }
      },
      _sum: { activityCount: true }
    }),

    // Total XP earned in last 30 days
    prisma.dailyActivity.aggregate({
      where: {
        userId,
        activityDate: { gte: thirtyDaysAgo }
      },
      _sum: { totalXp: true }
    }),

    // Number of active days in last 30 days
    prisma.dailyActivity.count({
      where: {
        userId,
        activityDate: { gte: thirtyDaysAgo }
      },
      distinct: ['activityDate']
    }),

    // Best day (most XP earned)
    prisma.dailyActivity.findFirst({
      where: {
        userId,
        activityDate: { gte: thirtyDaysAgo }
      },
      orderBy: { totalXp: 'desc' },
      select: {
        activityDate: true,
        totalXp: true,
        activityCount: true
      }
    }),

    // Consistency rate (percentage of active days)
    prisma.dailyActivity.groupBy({
      by: ['activityDate'],
      where: {
        userId,
        activityDate: { gte: thirtyDaysAgo }
      },
      _count: { id: true }
    })
  ]);

  const totalDays = 30;
  const consistencyRate = Math.round((activeDays / totalDays) * 100);

  return {
    period: 'last_30_days',
    totalActivities: totalActivities._sum.activityCount || 0,
    totalXp: totalXp._sum.totalXp || 0,
    activeDays,
    consistencyRate,
    bestDay: bestDay ? {
      date: formatDate(bestDay.activityDate, streakData.timezone),
      xp: bestDay.totalXp,
      activities: bestDay.activityCount
    } : null,
    averageDailyXp: activeDays > 0 ? Math.round((totalXp._sum.totalXp || 0) / activeDays) : 0,
    streakHistory: await getStreakHistory(userId)
  };
}

// Get streak history (all streaks longer than 1 day)
async function getStreakHistory(userId: string) {
  const activities = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { activityDate: 'asc' },
    select: { activityDate: true }
  });

  const streaks = [];
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const activity of activities) {
    if (!lastDate) {
      currentStreak = 1;
      lastDate = activity.activityDate;
      continue;
    }

    const daysDiff = getDaysDifference(
      activity.activityDate.toISOString().split('T')[0],
      lastDate.toISOString().split('T')[0],
      'UTC'
    );

    if (daysDiff === 1) {
      currentStreak++;
    } else if (daysDiff > 1) {
      if (currentStreak > 1) {
        streaks.push({
          length: currentStreak,
          endDate: formatDate(lastDate, 'UTC')
        });
      }
      currentStreak = 1;
    }

    lastDate = activity.activityDate;
  }

  // Add the last streak
  if (currentStreak > 1) {
    streaks.push({
      length: currentStreak,
      endDate: formatDate(lastDate!, 'UTC')
    });
  }

  return streaks.sort((a, b) => b.length - a.length).slice(0, 5); // Top 5 streaks
}

// Helper functions
function getCurrentDate(timezone: string): string {
  return new Date().toISOString().split('T')[0];
}

function getPreviousDate(date: string): string {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function formatDate(date: Date | string, timezone: string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function isSameDate(date1: Date | string, date2: string, timezone: string): boolean {
  return formatDate(date1, timezone) === date2;
}

function getDaysDifference(date1: string, date2: string, timezone: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

function getNextResetTime(timezone: string): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

async function calculateConsecutiveDays(activities: any[], timezone: string): Promise<number> {
  if (activities.length === 0) return 0;
  
  let streak = 1;
  let previousDate = formatDate(activities[0].activityDate, timezone);

  for (let i = 1; i < activities.length; i++) {
    const currentDate = formatDate(activities[i].activityDate, timezone);
    const daysDiff = getDaysDifference(previousDate, currentDate, timezone);
    
    if (daysDiff === 1) {
      streak++;
      previousDate = currentDate;
    } else if (daysDiff > 1) {
      break; // Streak broken
    }
    // If daysDiff === 0, same day - skip
  }

  return streak;
}