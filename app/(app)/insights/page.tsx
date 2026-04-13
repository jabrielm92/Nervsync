"use client"

import { useState, useEffect } from "react"
import {
  Brain,
  RefreshCw,
  ChevronDown,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PatternCard from "@/components/insights/PatternCard"
import RegulationScore from "@/components/insights/RegulationScore"
import WeeklyReport from "@/components/insights/WeeklyReport"
import type { WeeklyInsights } from "@/lib/claude-insights"

interface WeekSummary {
  startDate: string
  endDate: string
  averageScore: number
  checkinCount: number
  highScore: number
  lowScore: number
}

interface InsightsData {
  weeks: WeekSummary[]
  totalScores: number
}

function formatWeekLabel(start: string, end: string): string {
  const s = new Date(start + "T00:00:00")
  const e = new Date(end + "T00:00:00")
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  if (s.getMonth() === e.getMonth()) {
    return `${months[s.getMonth()]} ${s.getDate()}-${e.getDate()}`
  }
  return `${months[s.getMonth()]} ${s.getDate()} - ${months[e.getMonth()]} ${e.getDate()}`
}

function SkeletonCard() {
  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-[#334155]" />
          <div className="h-3 w-full rounded bg-[#334155]" />
          <div className="h-3 w-3/4 rounded bg-[#334155]" />
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonReport() {
  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-[#334155]" />
          <div className="h-3 w-full rounded bg-[#334155]" />
          <div className="h-3 w-2/3 rounded bg-[#334155]" />
          <div className="h-24 rounded bg-[#334155]/50" />
          <div className="h-3 w-full rounded bg-[#334155]" />
          <div className="h-3 w-5/6 rounded bg-[#334155]" />
          <div className="h-16 rounded bg-[#334155]/50" />
          <div className="h-3 w-3/4 rounded bg-[#334155]" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function InsightsPage() {
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null)
  const [weeklyReport, setWeeklyReport] = useState<WeeklyInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInsights()
  }, [])

  async function fetchInsights() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/insights?weeks=8")
      if (!res.ok) throw new Error("Failed to fetch insights")
      const data: InsightsData = await res.json()
      setInsightsData(data)
    } catch {
      setError("Could not load insights data.")
    } finally {
      setLoading(false)
    }
  }

  async function generateReport() {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/insights", { method: "POST" })
      if (!res.ok) throw new Error("Failed to generate")
      const report: WeeklyInsights = await res.json()
      setWeeklyReport(report)
    } catch {
      setError("Could not generate report. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const currentWeek = insightsData?.weeks?.[0] ?? null
  const historicalWeeks = insightsData?.weeks?.slice(1) ?? []

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#A855F7]/20">
            <Brain className="w-5 h-5 text-[#A855F7]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">Insights</h1>
            <p className="text-xs text-[#64748B]">
              Pattern intelligence for your nervous system
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex justify-center py-4">
            <div className="w-32 h-32 rounded-full bg-[#334155] animate-pulse" />
          </div>
          <SkeletonReport />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Current week score hero */}
          {currentWeek && (
            <Card className="border-[#334155] bg-[#1E293B]">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row items-center gap-5">
                  <RegulationScore
                    score={currentWeek.averageScore}
                    size={140}
                    strokeWidth={12}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">
                      This Week
                    </p>
                    <p className="text-lg font-bold text-[#F8FAFC] mb-2">
                      {formatWeekLabel(
                        currentWeek.startDate,
                        currentWeek.endDate
                      )}
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-sm font-bold text-[#F8FAFC]">
                          {currentWeek.checkinCount}
                        </p>
                        <p className="text-[10px] text-[#64748B]">Check-ins</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#10B981]">
                          {currentWeek.highScore}
                        </p>
                        <p className="text-[10px] text-[#64748B]">High</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#EF4444]">
                          {currentWeek.lowScore}
                        </p>
                        <p className="text-[10px] text-[#64748B]">Low</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Report button */}
          <Button
            onClick={generateReport}
            disabled={generating}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing patterns...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Generate Weekly Report
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Weekly Report */}
          {weeklyReport && (
            <div className="space-y-4">
              <WeeklyReport
                insights={weeklyReport}
                weekLabel={
                  currentWeek
                    ? formatWeekLabel(
                        currentWeek.startDate,
                        currentWeek.endDate
                      )
                    : "This Week"
                }
              />

              {/* Individual pattern cards from the report */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[#94A3B8] px-1">
                  Key Patterns
                </h3>

                <PatternCard
                  type="pattern"
                  headline={`Dominant state: ${weeklyReport.statePatterns.dominantState}`}
                  detail={weeklyReport.statePatterns.summary}
                />

                <PatternCard
                  type={
                    weeklyReport.regulationTrends.direction === "improving"
                      ? "trend-up"
                      : weeklyReport.regulationTrends.direction === "declining"
                        ? "trend-down"
                        : "trend-stable"
                  }
                  headline={`Regulation: ${weeklyReport.regulationTrends.direction}`}
                  detail={weeklyReport.regulationTrends.summary}
                />

                {weeklyReport.triggerMap.identifiedTriggers.map(
                  (trigger, i) => (
                    <PatternCard
                      key={`trigger-${i}`}
                      type="trigger"
                      headline={trigger}
                      detail={weeklyReport.triggerMap.summary}
                    />
                  )
                )}

                {weeklyReport.triggerMap.protectiveFactors.map(
                  (factor, i) => (
                    <PatternCard
                      key={`protective-${i}`}
                      type="protective"
                      headline={factor}
                      detail="This factor appears to support your regulation."
                    />
                  )
                )}

                {weeklyReport.recommendations.map((rec, i) => (
                  <PatternCard
                    key={`rec-${i}`}
                    type="recommendation"
                    headline={rec.title}
                    detail={rec.description}
                    priority={rec.priority}
                  />
                ))}

                {weeklyReport.celebrations.map((celebration, i) => (
                  <PatternCard
                    key={`cel-${i}`}
                    type="celebration"
                    headline="Celebration"
                    detail={celebration}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Historical weeks */}
          {historicalWeeks.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 w-full py-3 text-left"
              >
                <BarChart3 className="w-4 h-4 text-[#64748B]" />
                <span className="text-sm font-medium text-[#94A3B8]">
                  Past Weeks ({historicalWeeks.length})
                </span>
                <ChevronDown
                  className="w-4 h-4 text-[#64748B] ml-auto transition-transform duration-200"
                  style={{
                    transform: showHistory
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {showHistory && (
                <div className="space-y-3">
                  {historicalWeeks.map((week, i) => (
                    <Card
                      key={i}
                      className="border-[#334155] bg-[#1E293B]"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#F8FAFC]">
                              {formatWeekLabel(week.startDate, week.endDate)}
                            </p>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              {week.checkinCount} check-in
                              {week.checkinCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#F8FAFC]">
                              {week.averageScore}
                            </p>
                            <p className="text-[10px] text-[#64748B]">
                              avg score
                            </p>
                          </div>
                        </div>

                        {/* Mini bar */}
                        <div className="mt-3 h-1.5 rounded-full bg-[#0F172A] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${week.averageScore}%`,
                              backgroundColor:
                                week.averageScore > 75
                                  ? "#14B8A6"
                                  : week.averageScore > 50
                                    ? "#10B981"
                                    : week.averageScore > 25
                                      ? "#F59E0B"
                                      : "#EF4444",
                            }}
                          />
                        </div>

                        <div className="flex justify-between mt-2 text-[10px] text-[#64748B]">
                          <span>
                            Low:{" "}
                            <span className="text-[#EF4444] font-medium">
                              {week.lowScore}
                            </span>
                          </span>
                          <span>
                            High:{" "}
                            <span className="text-[#10B981] font-medium">
                              {week.highScore}
                            </span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state when no data at all */}
          {!currentWeek && !weeklyReport && (
            <Card className="border-[#334155] bg-[#1E293B]">
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 text-[#334155] mx-auto mb-3" />
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  No insights yet
                </h3>
                <p className="text-sm text-[#64748B] max-w-xs mx-auto">
                  Start checking in daily to build your pattern intelligence.
                  We need at least a few days of data to generate insights.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
