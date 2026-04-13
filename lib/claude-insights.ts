import Anthropic from "@anthropic-ai/sdk"
import { prisma } from "./db"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface WeeklyInsights {
  statePatterns: {
    dominantState: string
    stateDistribution: Record<string, number>
    summary: string
  }
  regulationTrends: {
    direction: "improving" | "declining" | "stable"
    averageScore: number
    highPoint: number
    lowPoint: number
    summary: string
  }
  triggerMap: {
    identifiedTriggers: string[]
    protectiveFactors: string[]
    summary: string
  }
  recommendations: Array<{
    title: string
    description: string
    priority: "high" | "medium" | "low"
  }>
  celebrations: string[]
}

export async function generateWeeklyInsights(userId: string): Promise<WeeklyInsights> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const checkins = await prisma.checkin.findMany({
    where: { userId, checkedInAt: { gte: sevenDaysAgo } },
    orderBy: { checkedInAt: "asc" },
    select: {
      primaryState: true,
      intensity: true,
      physicalSymptoms: true,
      energyLevel: true,
      sleepQuality: true,
      mood: true,
      contextTags: true,
      regulationScore: true,
      checkedInAt: true,
    },
  })

  const sessions = await prisma.session.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: "asc" },
    select: {
      title: true,
      completedAt: true,
      completionPercent: true,
      completionRating: true,
      postSessionState: true,
      feltShift: true,
      durationMinutes: true,
    },
  })

  const scores = await prisma.regulationScore.findMany({
    where: { userId, date: { gte: sevenDaysAgo } },
    orderBy: { date: "asc" },
    select: { score: true, date: true },
  })

  const journalEntries = await prisma.journalEntry.findMany({
    where: { userId, createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: "asc" },
    select: {
      content: true,
      tags: true,
      emotionalTone: true,
      linkedState: true,
      createdAt: true,
    },
  })

  const sleepLogs = await prisma.sleepLog.findMany({
    where: { userId, date: { gte: sevenDaysAgo } },
    orderBy: { date: "asc" },
    select: {
      sleepQuality: true,
      sleepDuration: true,
      wakeFeeling: true,
      date: true,
    },
  })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currentStreak: true,
      longestStreak: true,
      totalSessions: true,
      primaryGoal: true,
    },
  })

  const dataPayload = {
    checkins: checkins.map((c: { primaryState: string; intensity: number; physicalSymptoms: string[]; energyLevel: number | null; sleepQuality: number | null; mood: string | null; contextTags: string[]; regulationScore: number | null; checkedInAt: Date }) => ({
      state: c.primaryState,
      intensity: c.intensity,
      symptoms: c.physicalSymptoms,
      energy: c.energyLevel,
      sleep: c.sleepQuality,
      mood: c.mood,
      context: c.contextTags,
      score: c.regulationScore,
      date: c.checkedInAt.toISOString(),
    })),
    sessions: sessions.map((s: { title: string; completedAt: Date | null; completionPercent: number | null; completionRating: number | null; postSessionState: string | null; feltShift: boolean | null; durationMinutes: number }) => ({
      title: s.title,
      completed: !!s.completedAt,
      completionPercent: s.completionPercent,
      rating: s.completionRating,
      postState: s.postSessionState,
      feltShift: s.feltShift,
      duration: s.durationMinutes,
    })),
    regulationScores: scores.map((s: { score: number; date: Date }) => ({
      score: s.score,
      date: s.date.toISOString(),
    })),
    journalEntries: journalEntries.map((j: { tags: string[]; emotionalTone: string | null; linkedState: string | null; createdAt: Date; content: string }) => ({
      themes: j.tags,
      tone: j.emotionalTone,
      linkedState: j.linkedState,
      date: j.createdAt.toISOString(),
      // Send a truncated version of content for privacy
      snippet: j.content.substring(0, 200),
    })),
    sleepLogs: sleepLogs.map((s: { sleepQuality: number | null; sleepDuration: number | null; wakeFeeling: string | null; date: Date }) => ({
      quality: s.sleepQuality,
      duration: s.sleepDuration,
      wakeFeeling: s.wakeFeeling,
      date: s.date.toISOString(),
    })),
    streak: user?.currentStreak ?? 0,
    longestStreak: user?.longestStreak ?? 0,
    totalSessions: user?.totalSessions ?? 0,
    primaryGoal: user?.primaryGoal,
  }

  const prompt = `Analyze this user's nervous system regulation data from the past 7 days and generate weekly insights.

DATA:
${JSON.stringify(dataPayload, null, 2)}

Generate a JSON response with this exact schema:
{
  "statePatterns": {
    "dominantState": "string - the most frequent state",
    "stateDistribution": { "state_name": percentage_number, ... },
    "summary": "string - 2-3 sentence analysis of their state patterns this week"
  },
  "regulationTrends": {
    "direction": "improving" | "declining" | "stable",
    "averageScore": number,
    "highPoint": number,
    "lowPoint": number,
    "summary": "string - 2-3 sentence analysis of their regulation trend"
  },
  "triggerMap": {
    "identifiedTriggers": ["string array of potential triggers or patterns that preceded dysregulation"],
    "protectiveFactors": ["string array of things that seemed to help regulation"],
    "summary": "string - 2-3 sentence summary of trigger/protective patterns"
  },
  "recommendations": [
    {
      "title": "string",
      "description": "string - actionable recommendation based on their data",
      "priority": "high" | "medium" | "low"
    }
  ],
  "celebrations": ["string array of 2-3 specific things to celebrate from this week"]
}

Be warm, specific, and data-driven. Reference actual patterns you see. Keep summaries concise. Provide 3-5 recommendations. Always include celebrations even if the week was difficult - find the effort, the showing up, the small shifts.

Respond with valid JSON only.`

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system:
        "You are a nervous system pattern analyst. You examine user regulation data and generate structured weekly insights. Always respond with valid JSON. Be warm, accurate, and encouraging while remaining honest about patterns.",
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return JSON.parse(text) as WeeklyInsights
  } catch (error) {
    console.error("Failed to generate weekly insights:", error)
    return buildFallbackInsights(checkins, scores)
  }
}

function buildFallbackInsights(
  checkins: Array<{ primaryState: string; intensity: number; contextTags: string[] }>,
  scores: Array<{ score: number; date: Date }>
): WeeklyInsights {
  // Calculate state distribution
  const stateCounts: Record<string, number> = {}
  for (const c of checkins) {
    stateCounts[c.primaryState] = (stateCounts[c.primaryState] ?? 0) + 1
  }
  const total = checkins.length || 1
  const stateDistribution: Record<string, number> = {}
  let dominantState = "unknown"
  let maxCount = 0
  for (const [state, count] of Object.entries(stateCounts)) {
    stateDistribution[state] = Math.round((count / total) * 100)
    if (count > maxCount) {
      maxCount = count
      dominantState = state
    }
  }

  // Calculate score trends
  const scoreValues = scores.map((s) => s.score)
  const avgScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : 50
  const highPoint = scoreValues.length > 0 ? Math.max(...scoreValues) : 50
  const lowPoint = scoreValues.length > 0 ? Math.min(...scoreValues) : 50

  let direction: "improving" | "declining" | "stable" = "stable"
  if (scoreValues.length >= 2) {
    const firstHalf = scoreValues.slice(0, Math.floor(scoreValues.length / 2))
    const secondHalf = scoreValues.slice(Math.floor(scoreValues.length / 2))
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    if (secondAvg - firstAvg > 5) direction = "improving"
    else if (firstAvg - secondAvg > 5) direction = "declining"
  }

  return {
    statePatterns: {
      dominantState,
      stateDistribution,
      summary: `Your most frequent state this week was ${dominantState.replace(/_/g, " ")}. You checked in ${checkins.length} times over the past 7 days.`,
    },
    regulationTrends: {
      direction,
      averageScore: avgScore,
      highPoint,
      lowPoint,
      summary: `Your average regulation score was ${avgScore}/100 this week. Your scores have been ${direction}.`,
    },
    triggerMap: {
      identifiedTriggers: [],
      protectiveFactors: [],
      summary:
        "We need more data to identify specific triggers and protective factors. Keep checking in to help us spot patterns.",
    },
    recommendations: [
      {
        title: "Keep checking in",
        description:
          "Regular check-ins help us understand your patterns and provide better recommendations.",
        priority: "high",
      },
      {
        title: "Try a regulation session",
        description:
          "Even a short 5-minute session can help shift your state and build your regulation capacity.",
        priority: "medium",
      },
    ],
    celebrations: [
      "You showed up and checked in this week - that takes awareness and courage.",
      "Every data point you share helps build a clearer picture of your nervous system patterns.",
    ],
  }
}
