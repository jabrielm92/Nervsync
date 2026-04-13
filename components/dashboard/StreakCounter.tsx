"use client"

import { Flame } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
}

export default function StreakCounter({
  currentStreak,
  longestStreak,
}: StreakCounterProps) {
  // Flame intensity based on streak length
  const flameColor =
    currentStreak >= 30
      ? "#EF4444"
      : currentStreak >= 14
        ? "#F97316"
        : currentStreak >= 7
          ? "#F59E0B"
          : currentStreak >= 3
            ? "#FBBF24"
            : "#94A3B8"

  const glowOpacity =
    currentStreak >= 7 ? 0.4 : currentStreak >= 3 ? 0.2 : 0

  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Glow behind flame */}
          {glowOpacity > 0 && (
            <div
              className="absolute w-12 h-12 rounded-full blur-lg"
              style={{
                backgroundColor: flameColor,
                opacity: glowOpacity,
              }}
            />
          )}
          <Flame
            className="w-8 h-8 relative z-10"
            style={{ color: flameColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#F8FAFC]">
              {currentStreak}
            </span>
            <span className="text-sm font-medium text-[#94A3B8]">
              day{currentStreak !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Longest: {longestStreak} day{longestStreak !== 1 ? "s" : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
