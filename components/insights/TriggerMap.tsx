"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Zap } from "lucide-react"

interface TriggerMapProps {
  triggers: string[]
  protectiveFactors: string[]
}

const triggerColors = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EC4899",
  "#A855F7",
  "#DC2626",
  "#E11D48",
  "#D946EF",
]

const protectiveColors = [
  "#14B8A6",
  "#10B981",
  "#3B82F6",
  "#06B6D4",
  "#22D3EE",
  "#34D399",
  "#2DD4BF",
  "#38BDF8",
]

function Bubble({
  label,
  color,
  baseSize,
  index,
  total,
}: {
  label: string
  color: string
  baseSize: number
  index: number
  total: number
}) {
  // Size decreases with index to simulate frequency
  const sizeFactor = 1 - (index / (total + 1)) * 0.4
  const size = Math.max(baseSize * sizeFactor, 56)

  return (
    <div
      className="flex items-center justify-center rounded-full transition-transform hover:scale-105"
      style={{
        width: size,
        height: size,
        backgroundColor: color + "18",
        border: `1.5px solid ${color}40`,
      }}
    >
      <span
        className="text-[11px] font-medium text-center leading-tight px-2"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  )
}

export default function TriggerMap({
  triggers,
  protectiveFactors,
}: TriggerMapProps) {
  const hasData = triggers.length > 0 || protectiveFactors.length > 0

  if (!hasData) {
    return (
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Trigger Map
            </h3>
          </div>
          <p className="text-sm text-[#64748B] text-center py-6">
            Keep checking in to reveal your trigger and protective factor
            patterns.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#F59E0B]" />
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Trigger Map</h3>
        </div>

        {/* Triggers */}
        {triggers.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-[#EF4444] mb-2 uppercase tracking-wider">
              Triggers
            </p>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {triggers.map((trigger, i) => (
                <Bubble
                  key={trigger}
                  label={trigger}
                  color={triggerColors[i % triggerColors.length]}
                  baseSize={80}
                  index={i}
                  total={triggers.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Protective Factors */}
        {protectiveFactors.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[#14B8A6] mb-2 uppercase tracking-wider">
              Protective Factors
            </p>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {protectiveFactors.map((factor, i) => (
                <Bubble
                  key={factor}
                  label={factor}
                  color={protectiveColors[i % protectiveColors.length]}
                  baseSize={80}
                  index={i}
                  total={protectiveFactors.length}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
