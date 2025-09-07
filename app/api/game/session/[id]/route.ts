// app/api/game/session/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gameSession = await prisma.gameSession.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        userAnswers: {
          include: {
            question: {
              select: {
                question: true,
                explanation: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (!gameSession) {
      return NextResponse.json({ error: 'Game session not found' }, { status: 404 })
    }

    return NextResponse.json({ gameSession })
  } catch (error) {
    console.error('Error fetching game session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}