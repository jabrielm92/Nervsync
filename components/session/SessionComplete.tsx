"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Zap, Leaf, Cloud, Link, BatteryLow, Flame } from "lucide-react"

interface SessionCompleteProps {
  sessionId: string
  exerciseCount: number
}

const STATES = [
  { id: "fight_flight", label: "Wired", icon: Zap, color: "#F59E0B" },
  { id: "freeze", label: "Foggy", icon: Cloud, color: "#64748B" },
  { id: "fawn", label: "Tense", icon: Link, color: "#F472B6" },
  { id: "dorsal_collapse", label: "Drained", icon: BatteryLow, color: "#6366F1" },
  { id: "ventral_vagal", label: "Calm", icon: Leaf, color: "#14B8A6" },
]

export default function SessionComplete({
  sessionId,
  exerciseCount,
}: SessionCompleteProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [feltShift, setFeltShift] = useState<boolean | null>(null)
  const [postState, setPostState] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const [xpAmount, setXpAmount] = useState(25)
  const [streakData, setStreakData] = useState<{ currentStreak: number } | null>(null)

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch("/api/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          completionPercent: 100,
          completionRating: rating || undefined,
          postSessionState: postState || undefined,
          feltShift: feltShift ?? undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setXpAmount(data.xpAwarded ?? 25)
        if (data.streak) setStreakData(data.streak)
        setShowXp(true)
        // Wait for animation then redirect
        setTimeout(() => {
          router.push("/dashboard")
        }, 2200)
      } else {
        // On error still redirect
        router.push("/dashboard")
      }
    } catch {
      router.push("/dashboard")
    }
  }

  // XP earned animation overlay
  if (showXp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] px-6">
        <div
          className="flex flex-col items-center gap-6"
          style={{
            animation: "xpReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          {/* XP badge */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#3B82F6] flex items-center justify-center"
              style={{ animation: "pulse-gentle 2s ease-in-out infinite" }}
            >
              <Zap className="w-10 h-10 text-white" />
            </div>
            {/* Sparkle dots */}
            <div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#F59E0B]"
              style={{ animation: "xpSparkle 1s ease-out 0.3s both" }}
            />
            <div
              className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-[#14B8A6]"
              style={{ animation: "xpSparkle 1s ease-out 0.5s both" }}
            />
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-[#F8FAFC] mb-1">
              +{xpAmount} XP
            </p>
            <p className="text-[#94A3B8] text-sm">Session complete</p>
          </div>

          {streakData && streakData.currentStreak > 0 && (
            <div className="flex items-center gap-2 bg-[#1E293B] rounded-full px-4 py-2 border border-[#334155]">
              <Flame className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F8FAFC]">
                {streakData.currentStreak} day streak
              </span>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes xpReveal {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes xpSparkle {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0F172A] px-6 py-12 overflow-y-auto">
      {/* Celebration header */}
      <div
        className="text-center mb-10"
        style={{
          animation: "fadeSlideUp 0.6s ease-out both",
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#10B981] flex items-center justify-center"
          style={{ animation: "pulse-gentle 3s ease-in-out infinite" }}
        >
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-1">
          Beautiful work
        </h1>
        <p className="text-[#94A3B8] text-sm">
          You completed {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Star rating */}
      <div
        className="mb-8 text-center"
        style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}
      >
        <p className="text-sm font-medium text-[#CBD5E1] mb-3">
          How was this session?
        </p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="p-1 transition-transform active:scale-90"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  star <= rating
                    ? "text-[#F59E0B] fill-[#F59E0B]"
                    : "text-[#334155]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Felt shift toggle */}
      <div
        className="mb-8 text-center w-full max-w-xs"
        style={{ animation: "fadeSlideUp 0.6s ease-out 0.2s both" }}
      >
        <p className="text-sm font-medium text-[#CBD5E1] mb-3">
          Did you feel a shift?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setFeltShift(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              feltShift === true
                ? "bg-[#14B8A6] text-white"
                : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setFeltShift(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              feltShift === false
                ? "bg-[#334155] text-white"
                : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
            }`}
          >
            Not yet
          </button>
        </div>
      </div>

      {/* Post-session state */}
      <div
        className="mb-10 text-center w-full max-w-xs"
        style={{ animation: "fadeSlideUp 0.6s ease-out 0.3s both" }}
      >
        <p className="text-sm font-medium text-[#CBD5E1] mb-3">
          How do you feel now?
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {STATES.map((state) => {
            const Icon = state.icon
            const selected = postState === state.id
            return (
              <button
                key={state.id}
                onClick={() => setPostState(state.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all ${
                  selected
                    ? "border-2 scale-105"
                    : "bg-[#1E293B] border border-[#334155]"
                }`}
                style={
                  selected
                    ? {
                        borderColor: state.color,
                        backgroundColor: `${state.color}15`,
                      }
                    : undefined
                }
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: selected ? state.color : "#64748B" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: selected ? state.color : "#94A3B8" }}
                >
                  {state.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] text-white font-semibold text-base transition-all active:scale-[0.97] disabled:opacity-60"
        style={{ animation: "fadeSlideUp 0.6s ease-out 0.4s both" }}
      >
        {saving ? "Saving..." : "Save & Close"}
      </button>

      <style jsx>{`
        @keyframes fadeSlideUp {
          0% { transform: translateY(16px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
