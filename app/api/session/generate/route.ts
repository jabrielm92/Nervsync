import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generateSession } from "@/lib/claude"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { checkinId } = body

    if (!checkinId) {
      return NextResponse.json(
        { error: "checkinId is required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Fetch the checkin and verify ownership
    const checkin = await prisma.checkin.findUnique({
      where: { id: checkinId },
    })

    if (!checkin || checkin.userId !== userId) {
      return NextResponse.json(
        { error: "Checkin not found" },
        { status: 404 }
      )
    }

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        preferredDuration: true,
        primaryGoal: true,
      },
    })

    // Get last 7 sessions for variety
    const recentSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 7,
      select: {
        exercises: true,
        completionRating: true,
      },
    })

    // Extract exercise names and average rating for history context
    const completedExercises: string[] = []
    const ratings: number[] = []
    for (const s of recentSessions) {
      const exercises = s.exercises as Array<{ name: string }>
      if (Array.isArray(exercises)) {
        completedExercises.push(...exercises.map((e) => e.name))
      }
      if (s.completionRating) {
        ratings.push(s.completionRating)
      }
    }
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : undefined

    try {
      const generated = await generateSession({
        primaryState: checkin.primaryState,
        intensity: checkin.intensity,
        preferences: {
          preferredDuration: user?.preferredDuration ?? 10,
          primaryGoal: user?.primaryGoal ?? undefined,
        },
        history: {
          recentStates: [checkin.primaryState],
          completedExercises,
          averageRating,
        },
      })

      // Save session to DB linked to checkin
      const newSession = await prisma.session.create({
        data: {
          userId,
          checkinId,
          title: generated.title,
          description: generated.description,
          durationMinutes: generated.durationMinutes,
          targetState: generated.targetState,
          sessionType: "daily",
          exercises: generated.exercises as unknown as Record<string, unknown>[],
        },
      })

      return NextResponse.json(newSession, { status: 201 })
    } catch (aiError) {
      // Fallback: create a static session if Claude API fails
      console.error("AI session generation failed, using fallback:", aiError)

      const fallback = await generateSession({
        primaryState: checkin.primaryState,
        intensity: checkin.intensity,
      })

      const newSession = await prisma.session.create({
        data: {
          userId,
          checkinId,
          title: fallback.title,
          description: fallback.description,
          durationMinutes: fallback.durationMinutes,
          targetState: fallback.targetState,
          sessionType: "daily",
          exercises: fallback.exercises as unknown as Record<string, unknown>[],
        },
      })

      return NextResponse.json(newSession, { status: 201 })
    }
  } catch (error) {
    console.error("Session generate error:", error)
    return NextResponse.json(
      { error: "Failed to generate session" },
      { status: 500 }
    )
  }
}
