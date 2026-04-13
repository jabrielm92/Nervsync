import Anthropic from "@anthropic-ai/sdk"
import { prisma } from "./db"
import { calculateRegulationScore } from "./scoring"

export const COACH_SYSTEM_PROMPT = `You are a warm, knowledgeable nervous system regulation coach inside the NervSync app. Your name is simply "Coach." You draw on polyvagal theory, somatic experiencing, and evidence-based breathwork to help users understand and regulate their nervous system.

Core principles:
- Always validate the user's current state before offering guidance
- Use plain, accessible language - avoid jargon unless the user asks for it
- Never diagnose or replace therapy - you are a regulation support tool
- Celebrate small wins and micro-shifts
- Be trauma-informed: never push someone to "just relax" or force positivity
- Offer psychoeducation when it helps the user understand their patterns
- Keep responses concise (2-4 paragraphs max) unless the user asks for more detail
- Use the user's data context to personalize your responses

You can help with:
- Explaining nervous system states and what the user might be experiencing
- Suggesting in-the-moment regulation techniques
- Helping users understand their patterns and triggers
- Providing encouragement and celebrating streaks/progress
- Answering questions about polyvagal theory, breathwork, somatic practices
- Supporting users in building a daily regulation practice

You should NOT:
- Provide medical or psychiatric advice
- Diagnose conditions
- Encourage users to stop medication or therapy
- Make promises about outcomes
- Be overly clinical or detached - you are warm and human`

interface CoachContext {
  recentCheckins: Array<{
    primaryState: string
    intensity: number
    checkedInAt: Date
  }>
  currentStreak: number
  longestStreak: number
  regulationScores: Array<{
    score: number
    date: Date
  }>
  recentJournalThemes: string[]
  sleepQualityTrend: number[]
  programEnrollments: Array<{
    programName: string
    currentDay: number
    status: string
  }>
}

export async function getCoachContext(userId: string): Promise<CoachContext> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [user, checkins, scores, journalEntries, sleepLogs, enrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true },
    }),
    prisma.checkin.findMany({
      where: { userId, checkedInAt: { gte: sevenDaysAgo } },
      orderBy: { checkedInAt: "desc" },
      take: 7,
      select: { primaryState: true, intensity: true, checkedInAt: true },
    }),
    prisma.regulationScore.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      orderBy: { date: "desc" },
      take: 7,
      select: { score: true, date: true },
    }),
    prisma.journalEntry.findMany({
      where: { userId, createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: "desc" },
      take: 7,
      select: { tags: true, emotionalTone: true },
    }),
    prisma.sleepLog.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      orderBy: { date: "desc" },
      take: 7,
      select: { sleepQuality: true },
    }),
    prisma.programEnrollment.findMany({
      where: { userId, status: "active" },
      include: { program: { select: { name: true } } },
      take: 3,
    }),
  ])

  // Extract journal themes from tags and emotional tones
  const recentJournalThemes: string[] = []
  for (const entry of journalEntries) {
    if (entry.tags.length > 0) {
      recentJournalThemes.push(...entry.tags)
    }
    if (entry.emotionalTone) {
      recentJournalThemes.push(entry.emotionalTone)
    }
  }
  const uniqueThemes = Array.from(new Set(recentJournalThemes))

  return {
    recentCheckins: checkins,
    currentStreak: user?.currentStreak ?? 0,
    longestStreak: user?.longestStreak ?? 0,
    regulationScores: scores,
    recentJournalThemes: uniqueThemes,
    sleepQualityTrend: sleepLogs
      .map((log: { sleepQuality: number | null }) => log.sleepQuality)
      .filter((q: number | null): q is number => q !== null),
    programEnrollments: enrollments.map((e: { program: { name: string }; currentDay: number; status: string }) => ({
      programName: e.program.name,
      currentDay: e.currentDay,
      status: e.status,
    })),
  }
}

export function buildCoachMessages(
  context: CoachContext,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): Array<{ role: "user" | "assistant"; content: string }> {
  // Build the context summary as the first user message prefix
  const contextParts: string[] = []

  if (context.recentCheckins.length > 0) {
    const checkinSummary = context.recentCheckins
      .map(
        (c) =>
          `${c.checkedInAt.toLocaleDateString()}: ${c.primaryState} (intensity ${c.intensity}/5)`
      )
      .join("\n")
    contextParts.push(`Recent check-ins (last 7 days):\n${checkinSummary}`)
  }

  if (context.regulationScores.length > 0) {
    const scoreSummary = context.regulationScores
      .map((s) => `${s.date.toLocaleDateString()}: ${s.score}/100`)
      .join(", ")
    contextParts.push(`Regulation score trend: ${scoreSummary}`)
  }

  contextParts.push(`Current streak: ${context.currentStreak} days (best: ${context.longestStreak})`)

  if (context.recentJournalThemes.length > 0) {
    contextParts.push(`Recent journal themes: ${context.recentJournalThemes.join(", ")}`)
  }

  if (context.sleepQualityTrend.length > 0) {
    const avgSleep =
      context.sleepQualityTrend.reduce((a, b) => a + b, 0) / context.sleepQualityTrend.length
    contextParts.push(`Average sleep quality (7 days): ${avgSleep.toFixed(1)}/5`)
  }

  if (context.programEnrollments.length > 0) {
    const programSummary = context.programEnrollments
      .map((p) => `${p.programName} (day ${p.currentDay}, ${p.status})`)
      .join(", ")
    contextParts.push(`Active programs: ${programSummary}`)
  }

  const contextMessage = `[User context - use this to personalize your response but do not repeat it back verbatim]\n${contextParts.join("\n")}`

  // Prepend context to the first user message in the conversation
  const messages = [...conversationHistory]
  if (messages.length > 0 && messages[0].role === "user") {
    messages[0] = {
      ...messages[0],
      content: `${contextMessage}\n\n${messages[0].content}`,
    }
  } else {
    messages.unshift({ role: "user", content: contextMessage })
  }

  return messages
}
