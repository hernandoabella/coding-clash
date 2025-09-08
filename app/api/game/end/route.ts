// app/api/game/end/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, score, correctAnswers, totalQuestions, maxStreak, accuracy, timeSpent } = await request.json()
    
    // Update game session
    const gameSession = await prisma.gameSession.update({
      where: {
        id: sessionId,
        userId: session.user.id
      },
      data: {
        score,
        correctAnswers,
        totalQuestions,
        maxStreak,
        accuracy,
        timeSpent,
        completed: true,
        endTime: new Date(),
        status: 'COMPLETED'
      }
    })

    // Update user stats
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalScore: { increment: score },
        totalGames: { increment: 1 },
        correctAnswers: { increment: correctAnswers },
        totalAnswers: { increment: totalQuestions },
        maxStreak: Math.max(maxStreak, session.user.maxStreak || 0),
        xp: { increment: score }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error ending game session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}