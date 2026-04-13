import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { calculateRegulationScore } from "@/lib/scoring"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      primaryState,
      intensity,
      physicalSymptoms = [],
      energyLevel,
      sleepQuality,
      mood,
      contextTags = [],
    } = body

    if (!primaryState || !intensity) {
      return NextResponse.json(
        { error: "primaryState and intensity are required" },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Get user streak for regulation score calculation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true },
    })

    const regulationScore = calculateRegulationScore({
      primaryState,
      intensity,
      sessionCompleted: false,
      streakDays: user?.currentStreak ?? 0,
      sleepQuality: sleepQuality ?? undefined,
    })

    const checkin = await prisma.checkin.create({
      data: {
        userId,
        primaryState,
        intensity,
        physicalSymptoms,
        energyLevel,
        sleepQuality,
        mood,
        contextTags,
        regulationScore,
      },
    })

    // Upsert today's regulation score
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.regulationScore.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      create: {
        userId,
        date: today,
        score: regulationScore,
        checkinState: primaryState,
        checkinIntensity: intensity,
        sleepBonus: sleepQuality ? (sleepQuality - 3) * 2 : 0,
        streakBonus: Math.min(user?.currentStreak ?? 0, 10),
      },
      update: {
        score: regulationScore,
        checkinState: primaryState,
        checkinIntensity: intensity,
        sleepBonus: sleepQuality ? (sleepQuality - 3) * 2 : 0,
      },
    })

    return NextResponse.json(checkin, { status: 201 })
  } catch (error) {
    console.error("Checkin POST error:", error)
    return NextResponse.json(
      { error: "Failed to create checkin" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") ?? "30", 10)

    const checkins = await prisma.checkin.findMany({
      where: { userId: session.user.id },
      orderBy: { checkedInAt: "desc" },
      take: Math.min(limit, 100),
    })

    return NextResponse.json(checkins)
  } catch (error) {
    console.error("Checkin GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch checkins" },
      { status: 500 }
    )
  }
}
