// app/api/game/history/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const language = searchParams.get('language')
    const difficulty = searchParams.get('difficulty')

    const whereClause: any = {
      userId: session.user.id,
      completed: true
    }

    if (language) whereClause.language = language
    if (difficulty) whereClause.difficulty = difficulty

    const gameSessions = await prisma.gameSession.findMany({
      where: whereClause,
      orderBy: { endTime: 'desc' },
      take: limit,
      skip: offset,
      include: {
        userAnswers: {
          take: 5 // Include first 5 answers for preview
        }
      }
    })

    const totalCount = await prisma.gameSession.count({
      where: whereClause
    })

    return NextResponse.json({
      gameSessions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching game history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}