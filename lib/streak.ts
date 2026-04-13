import { prisma } from "./db"

export async function updateStreak(
  userId: string
): Promise<{ currentStreak: number; longestStreak: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true },
  })

  if (!user) throw new Error("User not found")

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Check if there's a completed session today
  const todaySession = await prisma.session.findFirst({
    where: {
      userId,
      completedAt: { gte: today },
    },
  })

  if (!todaySession) {
    return { currentStreak: user.currentStreak, longestStreak: user.longestStreak }
  }

  // Check if there was a completed session yesterday
  const yesterdaySession = await prisma.session.findFirst({
    where: {
      userId,
      completedAt: { gte: yesterday, lt: today },
    },
  })

  const newStreak = yesterdaySession ? user.currentStreak + 1 : 1
  const newLongest = Math.max(newStreak, user.longestStreak)

  await prisma.user.update({
    where: { id: userId },
    data: { currentStreak: newStreak, longestStreak: newLongest },
  })

  return { currentStreak: newStreak, longestStreak: newLongest }
}
