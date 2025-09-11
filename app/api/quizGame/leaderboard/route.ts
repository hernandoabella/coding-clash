// app/api/game/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const timeframe = searchParams.get('timeframe') || 'all-time' // all-time, weekly, monthly

    let dateFilter = {}
    if (timeframe === 'weekly') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      dateFilter = { endTime: { gte: oneWeekAgo } }
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      dateFilter = { endTime: { gte: oneMonthAgo } }
    }

    const leaderboard = await prisma.user.findMany({
      where: {
        gameSessions: {
          some: {
            completed: true,
            ...dateFilter
          }
        }
      },
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
        _count: {
          select: {
            gameSessions: {
              where: {
                completed: true,
                ...dateFilter
              }
            }
          }
        },
        gameSessions: {
          where: {
            completed: true,
            ...dateFilter
          },
          orderBy: { score: 'desc' },
          take: 1,
          select: { score: true }
        }
      },
      orderBy: { xp: 'desc' },
      take: limit
    })

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      xp: user.xp,
      level: user.level,
      gamesPlayed: user._count.gameSessions,
      highestScore: user.gameSessions[0]?.score || 0
    }))

    return NextResponse.json({ leaderboard: formattedLeaderboard, timeframe })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}