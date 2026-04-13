import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generateWeeklyInsights } from "@/lib/claude-insights"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const weeks = parseInt(searchParams.get("weeks") ?? "4", 10)
    const weeksBack = Math.min(weeks, 12)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - weeksBack * 7)

    const scores = await prisma.regulationScore.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startDate },
      },
      orderBy: { date: "desc" },
    })

    // Group scores by week
    const weeklyData: Record<string, { scores: number[]; startDate: string; endDate: string }> = {}
    for (const score of scores) {
      const d = new Date(score.date)
      // Get the Monday of the week
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(d)
      monday.setDate(diff)
      const weekKey = monday.toISOString().split("T")[0]

      if (!weeklyData[weekKey]) {
        const sunday = new Date(monday)
        sunday.setDate(sunday.getDate() + 6)
        weeklyData[weekKey] = {
          scores: [],
          startDate: monday.toISOString().split("T")[0],
          endDate: sunday.toISOString().split("T")[0],
        }
      }
      weeklyData[weekKey].scores.push(score.score)
    }

    const weeklySummaries = Object.entries(weeklyData).map(([, data]) => ({
      startDate: data.startDate,
      endDate: data.endDate,
      averageScore: Math.round(
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      ),
      checkinCount: data.scores.length,
      highScore: Math.max(...data.scores),
      lowScore: Math.min(...data.scores),
    }))

    return NextResponse.json({
      weeks: weeklySummaries,
      totalScores: scores.length,
    })
  } catch (error) {
    console.error("Insights GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch insights" },
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

    const insights = await generateWeeklyInsights(session.user.id)

    return NextResponse.json(insights, { status: 201 })
  } catch (error) {
    console.error("Insights POST error:", error)
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    )
  }
}
