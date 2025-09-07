// app/api/game/questions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!language || !difficulty) {
      return NextResponse.json(
        { error: 'Language and difficulty are required' },
        { status: 400 }
      )
    }

    // Get questions from database
    const questions = await prisma.question.findMany({
      where: {
        language,
        difficulty: difficulty.toLowerCase(),
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        category: true,
        difficulty: true
      }
    })

    // Shuffle questions and options
    const shuffledQuestions = questions
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        ...q,
        options: JSON.parse(q.options as string).sort(() => Math.random() - 0.5)
      }))

    return NextResponse.json({ questions: shuffledQuestions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}