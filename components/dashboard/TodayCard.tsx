"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CheckinData {
  id: string
  primaryState: string
  intensity: number
  regulationScore: number | null
  checkedInAt: string
}

const stateColors: Record<string, string> = {
  ventral: "#14B8A6",
  sympathetic: "#F59E0B",
  dorsal: "#EF4444",
  blended: "#6366F1",
  freeze: "#3B82F6",
  fight: "#EF4444",
  flight: "#F59E0B",
  shutdown: "#64748B",
}

function stateLabel(state: string): string {
  return state.charAt(0).toUpperCase() + state.slice(1)
}

export default function TodayCard() {
  const [todayCheckin, setTodayCheckin] = useState<CheckinData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchToday() {
      try {
        const res = await fetch("/api/checkin?limit=1")
        if (!res.ok) throw new Error("Failed to fetch")
        const data: CheckinData[] = await res.json()
        if (data.length > 0) {
          const latest = data[0]
          const checkinDate = new Date(latest.checkedInAt)
          const today = new Date()
          if (
            checkinDate.getFullYear() === today.getFullYear() &&
            checkinDate.getMonth() === today.getMonth() &&
            checkinDate.getDate() === today.getDate()
          ) {
            setTodayCheckin(latest)
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchToday()
  }, [])

  if (loading) {
    return (
      <Card className="relative overflow-hidden border-[#334155] bg-[#1E293B]">
        <CardContent className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-32 rounded bg-[#334155]" />
            <div className="h-8 w-48 rounded bg-[#334155]" />
            <div className="h-4 w-40 rounded bg-[#334155]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (todayCheckin) {
    const color = stateColors[todayCheckin.primaryState] ?? "#3B82F6"
    return (
      <Card className="relative overflow-hidden border-[#334155] bg-[#1E293B]">
        {/* Gradient border animation */}
        <div
          className="absolute inset-0 rounded-xl p-[1px]"
          style={{
            background: `linear-gradient(135deg, ${color}40, transparent 50%, ${color}20)`,
          }}
        />
        <CardContent className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
            <span className="text-sm font-medium text-[#14B8A6]">
              Checked in today
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xl font-bold text-[#F8FAFC]">
              {stateLabel(todayCheckin.primaryState)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
            <span>
              Intensity: <strong className="text-[#F8FAFC]">{todayCheckin.intensity}/10</strong>
            </span>
            {todayCheckin.regulationScore !== null && (
              <span>
                Score:{" "}
                <strong className="text-[#F8FAFC]">
                  {todayCheckin.regulationScore}
                </strong>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-[#334155] bg-[#1E293B]">
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-xl p-[1px]"
        style={{
          background:
            "linear-gradient(135deg, #3B82F640, #14B8A640, #3B82F640)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 3s ease infinite",
        }}
      />
      <CardContent className="relative p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          <span className="text-sm font-medium text-[#F59E0B]">
            Ready for today?
          </span>
        </div>
        <p className="text-[#94A3B8] text-sm mb-4">
          Take a moment to tune into your nervous system. Your body has wisdom to share.
        </p>
        <Link href="/checkin">
          <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2">
            Start today&apos;s check-in
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Card>
  )
}
