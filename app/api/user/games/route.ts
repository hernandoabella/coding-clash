// app/api/user/games/route.ts
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status'); // all, completed, active, abandoned
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const userId = session.user.id;

    // Build where clause based on filters
    const whereClause: any = {
      userId,
      ...(language && { language }),
      ...(difficulty && { difficulty }),
    };

    // Handle status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        whereClause.completed = true;
      } else if (status === 'active') {
        whereClause.completed = false;
        whereClause.status = 'ACTIVE';
      } else if (status === 'abandoned') {
        whereClause.completed = false;
        whereClause.status = 'ABANDONED';
      }
    }

    // Validate sort parameters
    const validSortFields = ['createdAt', 'score', 'correctAnswers', 'totalQuestions', 'timeSpent', 'accuracy'];
    const validSortOrders = ['asc', 'desc'];
    
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    // Get user's game sessions with pagination and filtering
    const gameSessions = await prisma.gameSession.findMany({
      where: whereClause,
      select: {
        id: true,
        language: true,
        difficulty: true,
        score: true,
        totalQuestions: true,
        correctAnswers: true,
        accuracy: true,
        completed: true,
        timeSpent: true,
        xpEarned: true,
        startTime: true,
        endTime: true,
        status: true,
        weaponUsed: true,
        userAnswers: {
          select: {
            id: true,
            isCorrect: true,
            timeSpent: true,
            answeredAt: true,
            question: {
              select: {
                category: true,
                difficulty: true,
              }
            }
          },
          orderBy: { answeredAt: 'asc' }
        }
      },
      orderBy: { [sortField]: order },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.gameSession.count({
      where: whereClause
    });

    // Calculate additional statistics
    const stats = await calculateGameStats(userId, whereClause);

    // Format the response
    const formattedGames = gameSessions.map(game => ({
      id: game.id,
      language: game.language,
      difficulty: game.difficulty,
      score: game.score,
      totalQuestions: game.totalQuestions,
      correctAnswers: game.correctAnswers,
      accuracy: game.accuracy,
      completed: game.completed,
      timeSpent: game.timeSpent,
      xpEarned: game.xpEarned,
      startTime: game.startTime,
      endTime: game.endTime,
      status: game.status,
      weaponUsed: game.weaponUsed,
      duration: game.endTime && game.startTime 
        ? Math.floor((game.endTime.getTime() - game.startTime.getTime()) / 1000)
        : null,
      averageTimePerQuestion: game.totalQuestions > 0 
        ? Math.round(game.timeSpent / game.totalQuestions) 
        : 0,
      questionBreakdown: calculateQuestionBreakdown(game.userAnswers),
      performance: calculatePerformanceMetrics(game.userAnswers)
    }));

    return NextResponse.json({
      games: formattedGames,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      filters: {
        language,
        difficulty,
        status,
        sortBy,
        sortOrder
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching user games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate question breakdown by category and difficulty
function calculateQuestionBreakdown(userAnswers: any[]) {
  const breakdown = {
    byCategory: {} as Record<string, { total: number; correct: number }>,
    byDifficulty: {} as Record<string, { total: number; correct: number }>,
  };

  userAnswers.forEach(answer => {
    const category = answer.question?.category || 'Unknown';
    const difficulty = answer.question?.difficulty || 'Unknown';

    // Initialize if not exists
    if (!breakdown.byCategory[category]) {
      breakdown.byCategory[category] = { total: 0, correct: 0 };
    }
    if (!breakdown.byDifficulty[difficulty]) {
      breakdown.byDifficulty[difficulty] = { total: 0, correct: 0 };
    }

    // Update counts
    breakdown.byCategory[category].total++;
    breakdown.byDifficulty[difficulty].total++;
    
    if (answer.isCorrect) {
      breakdown.byCategory[category].correct++;
      breakdown.byDifficulty[difficulty].correct++;
    }
  });

  // Calculate percentages
  Object.keys(breakdown.byCategory).forEach(category => {
    const { total, correct } = breakdown.byCategory[category];
    breakdown.byCategory[category] = {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  });

  Object.keys(breakdown.byDifficulty).forEach(difficulty => {
    const { total, correct } = breakdown.byDifficulty[difficulty];
    breakdown.byDifficulty[difficulty] = {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  });

  return breakdown;
}

// Calculate performance metrics
function calculatePerformanceMetrics(userAnswers: any[]) {
  const correctAnswers = userAnswers.filter(a => a.isCorrect);
  const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);

  const totalTime = userAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
  const averageTime = userAnswers.length > 0 ? Math.round(totalTime / userAnswers.length) : 0;

  const correctTimes = correctAnswers.map(a => a.timeSpent);
  const incorrectTimes = incorrectAnswers.map(a => a.timeSpent);

  return {
    totalAnswers: userAnswers.length,
    correctCount: correctAnswers.length,
    incorrectCount: incorrectAnswers.length,
    overallAccuracy: userAnswers.length > 0 
      ? Math.round((correctAnswers.length / userAnswers.length) * 100) 
      : 0,
    averageTimePerAnswer: averageTime,
    fastestCorrectAnswer: correctTimes.length > 0 ? Math.min(...correctTimes) : null,
    slowestCorrectAnswer: correctTimes.length > 0 ? Math.max(...correctTimes) : null,
    averageTimeCorrect: correctTimes.length > 0 
      ? Math.round(correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length) 
      : null,
    averageTimeIncorrect: incorrectTimes.length > 0 
      ? Math.round(incorrectTimes.reduce((a, b) => a + b, 0) / incorrectTimes.length) 
      : null,
  };
}

// Calculate overall game statistics
async function calculateGameStats(userId: string, whereClause: any) {
  const [
    totalGames,
    completedGames,
    totalScore,
    totalCorrectAnswers,
    totalQuestions,
    totalTimeSpent,
    bestScore,
    bestGame,
    languageStats,
    difficultyStats
  ] = await Promise.all([
    // Total games
    prisma.gameSession.count({ where: whereClause }),

    // Completed games
    prisma.gameSession.count({ 
      where: { ...whereClause, completed: true } 
    }),

    // Total score
    prisma.gameSession.aggregate({
      where: { ...whereClause, completed: true },
      _sum: { score: true }
    }),

    // Total correct answers
    prisma.gameSession.aggregate({
      where: { ...whereClause, completed: true },
      _sum: { correctAnswers: true }
    }),

    // Total questions
    prisma.gameSession.aggregate({
      where: { ...whereClause, completed: true },
      _sum: { totalQuestions: true }
    }),

    // Total time spent
    prisma.gameSession.aggregate({
      where: { ...whereClause, completed: true },
      _sum: { timeSpent: true }
    }),

    // Best score
    prisma.gameSession.aggregate({
      where: { ...whereClause, completed: true },
      _max: { score: true }
    }),

    // Best game (highest score)
    prisma.gameSession.findFirst({
      where: { ...whereClause, completed: true },
      orderBy: { score: 'desc' },
      select: {
        id: true,
        score: true,
        accuracy: true,
        language: true,
        difficulty: true,
        createdAt: true
      }
    }),

    // Stats by language
    prisma.gameSession.groupBy({
      by: ['language'],
      where: { ...whereClause, completed: true },
      _count: { id: true },
      _avg: { score: true, accuracy: true },
      _sum: { correctAnswers: true, totalQuestions: true, timeSpent: true }
    }),

    // Stats by difficulty
    prisma.gameSession.groupBy({
      by: ['difficulty'],
      where: { ...whereClause, completed: true },
      _count: { id: true },
      _avg: { score: true, accuracy: true },
      _sum: { correctAnswers: true, totalQuestions: true, timeSpent: true }
    })
  ]);

  const completedGamesCount = completedGames;
  const totalScoreSum = totalScore._sum.score || 0;
  const totalCorrectSum = totalCorrectAnswers._sum.correctAnswers || 0;
  const totalQuestionsSum = totalQuestions._sum.totalQuestions || 0;
  const totalTimeSum = totalTimeSpent._sum.timeSpent || 0;

  return {
    summary: {
      totalGames,
      completedGames: completedGamesCount,
      completionRate: totalGames > 0 ? Math.round((completedGamesCount / totalGames) * 100) : 0,
      totalScore: totalScoreSum,
      totalCorrectAnswers: totalCorrectSum,
      totalQuestions: totalQuestionsSum,
      overallAccuracy: totalQuestionsSum > 0 ? Math.round((totalCorrectSum / totalQuestionsSum) * 100) : 0,
      totalTimeSpent: totalTimeSum,
      averageScore: completedGamesCount > 0 ? Math.round(totalScoreSum / completedGamesCount) : 0,
      averageAccuracy: completedGamesCount > 0 
        ? Math.round((totalCorrectSum / totalQuestionsSum) * 100) 
        : 0,
      averageTimePerGame: completedGamesCount > 0 ? Math.round(totalTimeSum / completedGamesCount) : 0,
      bestScore: bestScore._max.score || 0,
      bestGame: bestGame
    },
    byLanguage: languageStats.reduce((acc, stat) => {
      acc[stat.language] = {
        games: stat._count.id,
        averageScore: Math.round(stat._avg.score || 0),
        averageAccuracy: Math.round(stat._avg.accuracy || 0),
        totalCorrect: stat._sum.correctAnswers || 0,
        totalQuestions: stat._sum.totalQuestions || 0,
        totalTime: stat._sum.timeSpent || 0
      };
      return acc;
    }, {} as Record<string, any>),
    byDifficulty: difficultyStats.reduce((acc, stat) => {
      acc[stat.difficulty] = {
        games: stat._count.id,
        averageScore: Math.round(stat._avg.score || 0),
        averageAccuracy: Math.round(stat._avg.accuracy || 0),
        totalCorrect: stat._sum.correctAnswers || 0,
        totalQuestions: stat._sum.totalQuestions || 0,
        totalTime: stat._sum.timeSpent || 0
      };
      return acc;
    }, {} as Record<string, any>)
  };
}

// Optional: POST endpoint to create a new game session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { language, difficulty, weaponUsed } = body;

    if (!language || !difficulty) {
      return NextResponse.json(
        { error: 'Language and difficulty are required' },
        { status: 400 }
      );
    }

    const gameSession = await prisma.gameSession.create({
      data: {
        userId: session.user.id,
        language,
        difficulty,
        weaponUsed,
        status: 'ACTIVE',
        startTime: new Date(),
      }
    });

    return NextResponse.json({ 
      success: true, 
      gameSession: {
        id: gameSession.id,
        language: gameSession.language,
        difficulty: gameSession.difficulty,
        weaponUsed: gameSession.weaponUsed
      }
    });
  } catch (error) {
    console.error('Error creating game session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}