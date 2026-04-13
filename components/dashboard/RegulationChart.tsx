"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ScorePoint {
  date: string
  score: number
}

export default function RegulationChart() {
  const [data, setData] = useState<ScorePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/checkin?limit=30")
        if (!res.ok) throw new Error("Failed")
        const checkins: Array<{
          checkedInAt: string
          regulationScore: number | null
        }> = await res.json()

        // Build 30-day map, keeping the latest score per day
        const dayMap = new Map<string, number>()
        for (const c of checkins) {
          if (c.regulationScore === null) continue
          const dateKey = new Date(c.checkedInAt).toISOString().split("T")[0]
          if (!dayMap.has(dateKey)) {
            dayMap.set(dateKey, c.regulationScore)
          }
        }

        // Build array for last 30 days
        const points: ScorePoint[] = []
        const today = new Date()
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today)
          d.setDate(d.getDate() - i)
          const key = d.toISOString().split("T")[0]
          if (dayMap.has(key)) {
            points.push({ date: key, score: dayMap.get(key)! })
          }
        }

        setData(points)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchScores()
  }, [])

  if (loading) {
    return (
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <div className="h-4 w-32 rounded bg-[#334155] animate-pulse mb-4" />
          <div className="h-40 rounded bg-[#334155]/50 animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (data.length < 2) {
    return (
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">
            30-Day Trend
          </h3>
          <div className="flex items-center justify-center h-32 text-sm text-[#64748B]">
            Check in more days to see your trend line.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Chart dimensions
  const chartWidth = 320
  const chartHeight = 140
  const paddingX = 8
  const paddingY = 12
  const innerWidth = chartWidth - paddingX * 2
  const innerHeight = chartHeight - paddingY * 2

  // Build SVG path
  const xStep = innerWidth / (data.length - 1)
  const points = data.map((d, i) => ({
    x: paddingX + i * xStep,
    y: paddingY + innerHeight - (d.score / 100) * innerHeight,
    score: d.score,
    date: d.date,
  }))

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + innerHeight} L ${points[0].x} ${paddingY + innerHeight} Z`

  // Date labels (show first, middle, last)
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1]

  function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00")
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">
          30-Day Trend
        </h3>
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>

            {/* Y-axis grid lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = paddingY + innerHeight - (val / 100) * innerHeight
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 2}
                    y={y + 3}
                    fill="#475569"
                    fontSize="8"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              )
            })}

            {/* Area fill */}
            <path d={areaD} fill="url(#tealGrad)" />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="2.5"
                fill="#14B8A6"
                stroke="#1E293B"
                strokeWidth="1"
              />
            ))}

            {/* Date labels */}
            {labelIndices.map((idx) => {
              if (idx >= points.length) return null
              const p = points[idx]
              return (
                <text
                  key={idx}
                  x={p.x}
                  y={chartHeight + 14}
                  fill="#64748B"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {formatShortDate(data[idx].date)}
                </text>
              )
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
