"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  AlertCircle,
  BookOpen,
  Moon,
  MessageCircle,
} from "lucide-react"
import TodayCard from "@/components/dashboard/TodayCard"
import StreakCounter from "@/components/dashboard/StreakCounter"
import NervousSystemGauge from "@/components/dashboard/NervousSystemGauge"
import WeeklySummary from "@/components/dashboard/WeeklySummary"
import GlimmerFeed from "@/components/dashboard/GlimmerFeed"
import RegulationChart from "@/components/dashboard/RegulationChart"

interface UserData {
  name: string | null
  currentStreak: number
  longestStreak: number
}

interface LatestCheckin {
  regulationScore: number | null
  checkedInAt: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const quickActions = [
  {
    label: "SOS",
    href: "/sos",
    icon: AlertCircle,
    color: "#EF4444",
    bgColor: "#EF444420",
  },
  {
    label: "Journal",
    href: "/journal",
    icon: BookOpen,
    color: "#A855F7",
    bgColor: "#A855F720",
  },
  {
    label: "Sleep",
    href: "/sleep",
    icon: Moon,
    color: "#3B82F6",
    bgColor: "#3B82F620",
  },
  {
    label: "Coach",
    href: "/coach",
    icon: MessageCircle,
    color: "#14B8A6",
    bgColor: "#14B8A620",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [regulationScore, setRegulationScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user data and latest checkin in parallel
        const [userRes, checkinRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch("/api/checkin?limit=1"),
        ])

        if (userRes.ok) {
          const sessionData = await userRes.json()
          if (sessionData?.user) {
            // Fetch additional user info
            setUser({
              name: sessionData.user.name ?? null,
              currentStreak: 0,
              longestStreak: 0,
            })
          }
        }

        if (checkinRes.ok) {
          const checkins: LatestCheckin[] = await checkinRes.json()
          if (checkins.length > 0 && checkins[0].regulationScore !== null) {
            const latest = checkins[0]
            const checkinDate = new Date(latest.checkedInAt)
            const today = new Date()
            if (
              checkinDate.getFullYear() === today.getFullYear() &&
              checkinDate.getMonth() === today.getMonth() &&
              checkinDate.getDate() === today.getDate()
            ) {
              setRegulationScore(latest.regulationScore)
            }
          }
        }

        // Try to fetch streak data
        try {
          const streakRes = await fetch("/api/auth/session")
          if (streakRes.ok) {
            const data = await streakRes.json()
            if (data?.user) {
              setUser((prev) => prev ? {
                ...prev,
                currentStreak: data.user.currentStreak ?? prev.currentStreak,
                longestStreak: data.user.longestStreak ?? prev.longestStreak,
              } : prev)
            }
          }
        } catch {
          // silent
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-[#334155]" />
          <div className="h-40 rounded-xl bg-[#1E293B]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 rounded-xl bg-[#1E293B]" />
            <div className="h-24 rounded-xl bg-[#1E293B]" />
          </div>
          <div className="h-32 rounded-xl bg-[#1E293B]" />
          <div className="h-32 rounded-xl bg-[#1E293B]" />
        </div>
      </div>
    )
  }

  const firstName = user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-4xl mx-auto">
      {/* Greeting */}
      <h1 className="text-2xl font-bold text-[#F8FAFC] mb-6">
        {getGreeting()}, {firstName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column (or full width on mobile) */}
        <div className="space-y-4">
          {/* Today's check-in status */}
          <TodayCard />

          {/* Streak + Gauge row */}
          <div className="grid grid-cols-2 gap-4">
            <StreakCounter
              currentStreak={user?.currentStreak ?? 0}
              longestStreak={user?.longestStreak ?? 0}
            />
            <div className="flex items-center justify-center">
              <NervousSystemGauge
                score={regulationScore ?? 0}
                size={120}
                strokeWidth={10}
              />
            </div>
          </div>

          {/* Weekly Summary */}
          <WeeklySummary />
        </div>

        {/* Right column (or continues below on mobile) */}
        <div className="space-y-4">
          {/* 30-day trend */}
          <RegulationChart />

          {/* Glimmer Feed */}
          <GlimmerFeed />

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#334155] bg-[#1E293B] hover:bg-[#334155]/60 transition-colors"
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: action.bgColor }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: action.color }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    {action.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
