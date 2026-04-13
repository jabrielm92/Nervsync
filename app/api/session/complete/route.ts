import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { updateStreak } from "@/lib/streak"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      sessionId,
      completionPercent,
      completionRating,
      postSessionState,
      postSessionIntensity,
      feltShift,
    } = body

    if (!sessionId || completionPercent === undefined) {
      return NextResponse.json(
        { error: "sessionId and completionPercent are required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Fetch the session and verify ownership
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!existingSession || existingSession.userId !== userId) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Update session as completed
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        completionPercent,
        completionRating,
        postSessionState,
        postSessionIntensity,
        feltShift,
      },
    })

    // Determine XP based on session type
    const xpAward = existingSession.sessionType === "sos" ? 15 : 25

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalSessions: { increment: 1 },
        totalMinutes: { increment: existingSession.durationMinutes },
        xp: { increment: xpAward },
      },
    })

    // Update streak
    const streak = await updateStreak(userId)

    return NextResponse.json({
      session: updatedSession,
      xpAwarded: xpAward,
      streak,
    })
  } catch (error) {
    console.error("Session complete error:", error)
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    )
  }
}
