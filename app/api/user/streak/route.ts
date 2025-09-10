// app/api/user/streak/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

// GET streak info
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currentStreak: true, maxStreak: true, lastStreakDate: true }
  });

  return NextResponse.json(user);
}

// POST to increment/reset streak
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let newStreak = user.currentStreak;
  let maxStreak = user.maxStreak;

  if (!user.lastStreakDate) {
    newStreak = 1;
  } else {
    const last = new Date(user.lastStreakDate);
    last.setHours(0, 0, 0, 0);

    const diffDays = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      newStreak = user.currentStreak + 1;
    } else if (diffDays > 1) {
      newStreak = 1; // reset
    }
  }

  if (newStreak > maxStreak) {
    maxStreak = newStreak;
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      currentStreak: newStreak,
      maxStreak,
      lastStreakDate: today
    },
    select: { currentStreak: true, maxStreak: true, lastStreakDate: true }
  });

  return NextResponse.json(updated);
}