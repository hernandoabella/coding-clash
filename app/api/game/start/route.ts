// app/api/game/start/route.ts
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

    const { language, difficulty, weapon } = await request.json()
    
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: session.user.id,
        language,
        difficulty,
        weaponUsed: weapon,
        score: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        maxStreak: 0,
        accuracy: 0,
        timeSpent: 0,
        status: 'ACTIVE',
        startTime: new Date(),
      }
    })

    return NextResponse.json({ sessionId: gameSession.id })
  } catch (error) {
    console.error('Error creating game session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}