// app/api/game/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get overall stats
    const overallStats = await prisma.gameSession.aggregate({
      where: {
        userId,
        completed: true
      },
      _count: { id: true },
      _sum: { score: true, correctAnswers: true, totalQuestions: true, timeSpent: true },
      _avg: { accuracy: true },
      _max: { score: true, maxStreak: true }
    })

    // Get stats by language
    const statsByLanguage = await prisma.gameSession.groupBy({
      by: ['language'],
      where: {
        userId,
        completed: true
      },
      _count: { id: true },
      _sum: { score: true, correctAnswers: true, totalQuestions: true },
      _avg: { accuracy: true }
    })

    // Get stats by difficulty
    const statsByDifficulty = await prisma.gameSession.groupBy({
      by: ['difficulty'],
      where: {
        userId,
        completed: true
      },
      _count: { id: true },
      _sum: { score: true, correctAnswers: true, totalQuestions: true },
      _avg: { accuracy: true }
    })

    // Get recent activity
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentActivity = await prisma.gameSession.count({
      where: {
        userId,
        completed: true,
        endTime: { gte: thirtyDaysAgo }
      }
    })

    return NextResponse.json({
      overall: {
        totalGames: overallStats._count.id,
        totalScore: overallStats._sum.score,
        totalCorrect: overallStats._sum.correctAnswers,
        totalQuestions: overallStats._sum.totalQuestions,
        totalTime: overallStats._sum.timeSpent,
        averageAccuracy: overallStats._avg.accuracy,
        highestScore: overallStats._max.score,
        longestStreak: overallStats._max.maxStreak
      },
      byLanguage: statsByLanguage,
      byDifficulty: statsByDifficulty,
      recentActivity
    })
  } catch (error) {
    console.error('Error fetching game stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}