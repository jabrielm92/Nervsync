"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface DayData {
  day: string
  score: number | null
}

function getBarColor(score: number): string {
  if (score <= 25) return "#EF4444"
  if (score <= 50) return "#F59E0B"
  if (score <= 75) return "#10B981"
  return "#14B8A6"
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function WeeklySummary() {
  const [days, setDays] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeek() {
      try {
        const res = await fetch("/api/checkin?limit=7")
        if (!res.ok) throw new Error("Failed to fetch")
        const checkins: Array<{
          checkedInAt: string
          regulationScore: number | null
        }> = await res.json()

        // Build last 7 days
        const today = new Date()
        const weekData: DayData[] = []

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const dayIndex = d.getDay()
          // Convert Sunday=0 to index 6, Monday=1 to index 0, etc.
          const label = DAY_LABELS[dayIndex === 0 ? 6 : dayIndex - 1]

          // Find checkin for this date
          const match = checkins.find((c) => {
            const cd = new Date(c.checkedInAt)
            return (
              cd.getFullYear() === d.getFullYear() &&
              cd.getMonth() === d.getMonth() &&
              cd.getDate() === d.getDate()
            )
          })

          weekData.push({
            day: label,
            score: match?.regulationScore ?? null,
          })
        }

        setDays(weekData)
      } catch {
        // Set empty week
        const today = new Date()
        const weekData: DayData[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const dayIndex = d.getDay()
          weekData.push({
            day: DAY_LABELS[dayIndex === 0 ? 6 : dayIndex - 1],
            score: null,
          })
        }
        setDays(weekData)
      } finally {
        setLoading(false)
      }
    }
    fetchWeek()
  }, [])

  if (loading) {
    return (
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded bg-[#334155] mb-4" />
            <div className="flex items-end gap-2 h-24">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[#334155]"
                  style={{ height: `${30 + Math.random() * 50}%` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">
          This Week
        </h3>
        <div className="flex items-end gap-2 h-24">
          {days.map((d, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className="w-full flex items-end justify-center h-16">
                {d.score !== null ? (
                  <div
                    className="w-full max-w-[28px] rounded-t-md transition-all duration-500"
                    style={{
                      height: `${Math.max(d.score, 8)}%`,
                      backgroundColor: getBarColor(d.score),
                    }}
                  />
                ) : (
                  <div className="w-full max-w-[28px] h-[4px] rounded bg-[#334155]" />
                )}
              </div>
              <span className="text-[10px] text-[#64748B] font-medium">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
