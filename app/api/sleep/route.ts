import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

function calculateSleepScore(params: {
  sleepQuality?: number | null
  sleepDuration?: number | null
  wakeFeeling?: string | null
  preStressLevel?: number | null
  screenFreeMinutes?: number | null
  eveningProtocolDone?: boolean
}): number {
  let score = 50

  // Sleep quality contributes up to 30 points
  if (params.sleepQuality != null) {
    score += (params.sleepQuality - 3) * 10
  }

  // Sleep duration: 7-9 hours is ideal
  if (params.sleepDuration != null) {
    if (params.sleepDuration >= 7 && params.sleepDuration <= 9) {
      score += 15
    } else if (params.sleepDuration >= 6 && params.sleepDuration <= 10) {
      score += 5
    } else {
      score -= 10
    }
  }

  // Wake feeling bonus
  if (params.wakeFeeling === "refreshed") score += 10
  else if (params.wakeFeeling === "okay") score += 5
  else if (params.wakeFeeling === "groggy") score -= 5
  else if (params.wakeFeeling === "exhausted") score -= 10

  // Low pre-stress is good
  if (params.preStressLevel != null) {
    score += (5 - params.preStressLevel) * 2
  }

  // Screen-free time bonus
  if (params.screenFreeMinutes != null && params.screenFreeMinutes >= 30) {
    score += 5
  }

  // Evening protocol bonus
  if (params.eveningProtocolDone) {
    score += 5
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sleepLogs = await prisma.sleepLog.findMany({
      where: {
        userId: session.user.id,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(sleepLogs)
  } catch (error) {
    console.error("Sleep GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch sleep logs" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      date,
      eveningProtocolDone,
      bedTime,
      preStressLevel,
      screenFreeMinutes,
      eveningNotes,
      wakeTime,
      sleepQuality,
      sleepDuration,
      wakeFeeling,
      dreamActivity,
      morningNotes,
    } = body

    if (!date) {
      return NextResponse.json(
        { error: "date is required" },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const logDate = new Date(date)
    logDate.setHours(0, 0, 0, 0)

    // Calculate sleep score
    const sleepScore = calculateSleepScore({
      sleepQuality,
      sleepDuration,
      wakeFeeling,
      preStressLevel,
      screenFreeMinutes,
      eveningProtocolDone,
    })

    // Determine XP: 10 for evening log, 10 for morning log
    // Check what already exists to determine what XP to award
    const existing = await prisma.sleepLog.findUnique({
      where: { userId_date: { userId, date: logDate } },
    })

    let xpAward = 0
    const isEveningLog = eveningProtocolDone !== undefined || bedTime || preStressLevel !== undefined
    const isMorningLog = wakeTime || sleepQuality !== undefined || sleepDuration !== undefined

    if (!existing) {
      // New log
      if (isEveningLog) xpAward += 10
      if (isMorningLog) xpAward += 10
    } else {
      // Update: award XP for newly added data
      if (isEveningLog && !existing.eveningProtocolDone && !existing.bedTime) xpAward += 10
      if (isMorningLog && !existing.wakeTime && existing.sleepQuality === null) xpAward += 10
    }

    // Upsert by userId + date
    const sleepLog = await prisma.sleepLog.upsert({
      where: { userId_date: { userId, date: logDate } },
      create: {
        userId,
        date: logDate,
        eveningProtocolDone: eveningProtocolDone ?? false,
        bedTime,
        preStressLevel,
        screenFreeMinutes,
        eveningNotes,
        wakeTime,
        sleepQuality,
        sleepDuration,
        wakeFeeling,
        dreamActivity,
        morningNotes,
        sleepScore,
      },
      update: {
        ...(eveningProtocolDone !== undefined && { eveningProtocolDone }),
        ...(bedTime !== undefined && { bedTime }),
        ...(preStressLevel !== undefined && { preStressLevel }),
        ...(screenFreeMinutes !== undefined && { screenFreeMinutes }),
        ...(eveningNotes !== undefined && { eveningNotes }),
        ...(wakeTime !== undefined && { wakeTime }),
        ...(sleepQuality !== undefined && { sleepQuality }),
        ...(sleepDuration !== undefined && { sleepDuration }),
        ...(wakeFeeling !== undefined && { wakeFeeling }),
        ...(dreamActivity !== undefined && { dreamActivity }),
        ...(morningNotes !== undefined && { morningNotes }),
        sleepScore,
      },
    })

    // Award XP if earned
    if (xpAward > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpAward } },
      })
    }

    return NextResponse.json({ ...sleepLog, xpAwarded: xpAward }, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error("Sleep POST error:", error)
    return NextResponse.json(
      { error: "Failed to save sleep log" },
      { status: 500 }
    )
  }
}
