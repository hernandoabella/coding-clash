// app/api/game/abandon/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: true }) // Silent success for unauthenticated users
    }

    const { language, difficulty } = await req.json()

    // Create an abandoned session record
    await prisma.gameSession.create({
      data: {
        userId: session.user.id,
        language,
        difficulty,
        status: 'ABANDONED',
        startTime: new Date(),
        endTime: new Date(),
        completed: false,
        score: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        timeSpent: 0
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking abandoned game:', error)
    return NextResponse.json({ success: true }) // Always return success for analytics
  }
}