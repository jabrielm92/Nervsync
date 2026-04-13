export function calculateRegulationScore(params: {
  primaryState: string
  intensity: number
  sessionCompleted: boolean
  postSessionImprovement?: number
  streakDays: number
  sleepQuality?: number
}): number {
  // Base score from state (ventral_vagal best, dorsal_collapse worst)
  const stateScores: Record<string, number> = {
    ventral_vagal: 85,
    fawn: 50,
    fight_flight: 40,
    freeze: 35,
    dorsal_collapse: 25,
  }

  let score = stateScores[params.primaryState] ?? 50

  // Intensity adjustment (higher intensity = lower score for dysregulated states)
  if (params.primaryState !== "ventral_vagal") {
    score -= (params.intensity - 1) * 5
  } else {
    score += (params.intensity - 1) * 3
  }

  // Session completion bonus
  if (params.sessionCompleted) {
    score += 10
  }

  // Post-session improvement bonus
  if (params.postSessionImprovement && params.postSessionImprovement > 0) {
    score += params.postSessionImprovement * 3
  }

  // Streak bonus (capped at 10)
  const streakBonus = Math.min(params.streakDays, 10)
  score += streakBonus

  // Sleep bonus
  if (params.sleepQuality) {
    score += (params.sleepQuality - 3) * 2
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}
