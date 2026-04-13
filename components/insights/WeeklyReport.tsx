"use client"

import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Target,
  PartyPopper,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { WeeklyInsights } from "@/lib/claude-insights"

interface WeeklyReportProps {
  insights: WeeklyInsights
  weekLabel: string
}

interface SectionProps {
  icon: LucideIcon
  iconColor: string
  title: string
  children: React.ReactNode
}

function Section({ icon: Icon, iconColor, title, children }: SectionProps) {
  return (
    <div className="py-4 border-b border-[#334155] last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ backgroundColor: iconColor + "20" }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <h3 className="text-sm font-semibold text-[#F8FAFC]">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function trendColor(direction: "improving" | "declining" | "stable"): string {
  if (direction === "improving") return "#10B981"
  if (direction === "declining") return "#EF4444"
  return "#F59E0B"
}

const stateBarColors: Record<string, string> = {
  ventral: "#14B8A6",
  sympathetic: "#F59E0B",
  dorsal: "#EF4444",
  blended: "#6366F1",
  freeze: "#3B82F6",
  fight: "#EF4444",
  flight: "#F59E0B",
  shutdown: "#64748B",
}

export default function WeeklyReport({
  insights,
  weekLabel,
}: WeeklyReportProps) {
  const { statePatterns, regulationTrends, triggerMap, recommendations, celebrations } = insights

  return (
    <Card className="border-[#334155] bg-[#1E293B] overflow-hidden">
      {/* Hero header */}
      <div className="px-5 pt-5 pb-3 bg-gradient-to-br from-[#3B82F6]/10 to-[#14B8A6]/10">
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
          Weekly Report
        </p>
        <h2 className="text-lg font-bold text-[#F8FAFC]">{weekLabel}</h2>
      </div>

      <CardContent className="p-5 pt-0">
        {/* State Pattern */}
        <Section icon={Brain} iconColor="#A855F7" title="State Pattern">
          <p className="text-sm text-[#94A3B8] mb-3">
            {statePatterns.summary}
          </p>
          <div className="space-y-2">
            {Object.entries(statePatterns.stateDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([state, pct]) => (
                <div key={state} className="flex items-center gap-3">
                  <span className="text-xs text-[#94A3B8] w-24 capitalize">
                    {state}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#0F172A] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          stateBarColors[state] ?? "#64748B",
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#CBD5E1] w-10 text-right">
                    {pct}%
                  </span>
                </div>
              ))}
          </div>
        </Section>

        {/* Regulation Trend */}
        <Section
          icon={regulationTrends.direction === "improving" ? TrendingUp : regulationTrends.direction === "declining" ? TrendingDown : Minus}
          iconColor={trendColor(regulationTrends.direction)}
          title="Regulation Trend"
        >
          <p className="text-sm text-[#94A3B8] mb-3">
            {regulationTrends.summary}
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-lg bg-[#0F172A]">
              <p className="text-lg font-bold text-[#F8FAFC]">
                {regulationTrends.averageScore}
              </p>
              <p className="text-[10px] text-[#64748B]">Average</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#0F172A]">
              <p className="text-lg font-bold text-[#10B981]">
                {regulationTrends.highPoint}
              </p>
              <p className="text-[10px] text-[#64748B]">High</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#0F172A]">
              <p className="text-lg font-bold text-[#EF4444]">
                {regulationTrends.lowPoint}
              </p>
              <p className="text-[10px] text-[#64748B]">Low</p>
            </div>
          </div>
        </Section>

        {/* Trigger Map */}
        <Section icon={Zap} iconColor="#F59E0B" title="Trigger Map">
          <p className="text-sm text-[#94A3B8] mb-3">{triggerMap.summary}</p>
          {triggerMap.identifiedTriggers.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-[#EF4444] mb-2 uppercase tracking-wider">
                Triggers
              </p>
              <div className="flex flex-wrap gap-2">
                {triggerMap.identifiedTriggers.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "#EF444418",
                      border: "1px solid #EF444440",
                      color: "#EF4444",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {triggerMap.protectiveFactors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#14B8A6] mb-2 uppercase tracking-wider">
                Protective Factors
              </p>
              <div className="flex flex-wrap gap-2">
                {triggerMap.protectiveFactors.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "#14B8A618",
                      border: "1px solid #14B8A640",
                      color: "#14B8A6",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Recommendations */}
        <Section icon={Target} iconColor="#3B82F6" title="Recommendations">
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const priorityStyle =
                rec.priority === "high"
                  ? { bg: "#EF444415", border: "#EF444430", dot: "#EF4444" }
                  : rec.priority === "medium"
                    ? { bg: "#F59E0B15", border: "#F59E0B30", dot: "#F59E0B" }
                    : { bg: "#3B82F615", border: "#3B82F630", dot: "#3B82F6" }

              return (
                <div
                  key={i}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: priorityStyle.bg,
                    border: `1px solid ${priorityStyle.border}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: priorityStyle.dot }}
                    />
                    <span className="text-sm font-medium text-[#F8FAFC]">
                      {rec.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] pl-4">
                    {rec.description}
                  </p>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Celebrations */}
        <Section
          icon={PartyPopper}
          iconColor="#F59E0B"
          title="Celebrations"
        >
          <div className="space-y-2">
            {celebrations.map((celebration, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded-lg bg-[#F59E0B]/5"
              >
                <span className="text-[#F59E0B] text-sm mt-0.5">*</span>
                <p className="text-sm text-[#CBD5E1]">{celebration}</p>
              </div>
            ))}
          </div>
        </Section>
      </CardContent>
    </Card>
  )
}
