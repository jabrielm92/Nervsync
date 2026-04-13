"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Shield,
  Zap,
  Heart,
  Star,
  Target,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type InsightType =
  | "pattern"
  | "trend-up"
  | "trend-down"
  | "trend-stable"
  | "trigger"
  | "protective"
  | "recommendation"
  | "celebration"

interface PatternCardProps {
  type: InsightType
  headline: string
  detail: string
  priority?: "high" | "medium" | "low"
}

const typeConfig: Record<InsightType, { icon: LucideIcon; color: string }> = {
  pattern: { icon: Brain, color: "#A855F7" },
  "trend-up": { icon: TrendingUp, color: "#10B981" },
  "trend-down": { icon: TrendingDown, color: "#EF4444" },
  "trend-stable": { icon: Minus, color: "#F59E0B" },
  trigger: { icon: Zap, color: "#EF4444" },
  protective: { icon: Shield, color: "#14B8A6" },
  recommendation: { icon: Target, color: "#3B82F6" },
  celebration: { icon: Star, color: "#F59E0B" },
}

const priorityBadge: Record<string, { bg: string; text: string }> = {
  high: { bg: "#EF444420", text: "#EF4444" },
  medium: { bg: "#F59E0B20", text: "#F59E0B" },
  low: { bg: "#3B82F620", text: "#3B82F6" },
}

export default function PatternCard({
  type,
  headline,
  detail,
  priority,
}: PatternCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <Card className="border-[#334155] bg-[#1E293B] overflow-hidden">
      <CardContent className="p-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#334155]/30 transition-colors"
        >
          <div
            className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ backgroundColor: config.color + "20" }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#F8FAFC] truncate">
                {headline}
              </span>
              {priority && (
                <span
                  className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: priorityBadge[priority].bg,
                    color: priorityBadge[priority].text,
                  }}
                >
                  {priority}
                </span>
              )}
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 text-[#64748B] transition-transform duration-200 flex-shrink-0"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        {expanded && (
          <div className="px-4 pb-4 pt-0 pl-16">
            <p className="text-sm text-[#94A3B8] leading-relaxed">{detail}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
