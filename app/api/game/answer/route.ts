// app/api/game/answer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, questionId, selectedAnswer, timeSpent, isCorrect } = await req.json()

    if (!sessionId || !questionId || !selectedAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Record user answer
    const userAnswer = await prisma.userAnswer.create({
      data: {
        userId: session.user.id,
        sessionId,
        questionId,
        selectedAnswer,
        timeSpent: timeSpent || 0,
        isCorrect: isCorrect || false,
        answeredAt: new Date()
      }
    })

    return NextResponse.json({ success: true, userAnswer })
  } catch (error) {
    console.error('Error recording user answer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}