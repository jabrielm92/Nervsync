"use client"

import { useEffect, useState } from "react"

interface RegulationScoreProps {
  score: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

function getScoreColor(score: number): string {
  if (score <= 25) return "#EF4444"
  if (score <= 50) return "#F59E0B"
  if (score <= 75) return "#10B981"
  return "#14B8A6"
}

function getScoreLabel(score: number): string {
  if (score <= 25) return "Dysregulated"
  if (score <= 50) return "Recovering"
  if (score <= 75) return "Balanced"
  return "Regulated"
}

export default function RegulationScore({
  score,
  size = 180,
  strokeWidth = 14,
  showLabel = true,
}: RegulationScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (animatedScore / 100) * circumference
  const offset = circumference - progress
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s ease-out, stroke 0.5s ease",
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs text-[#64748B] mt-0.5">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-medium text-[#94A3B8]">
            Regulation Score
          </p>
          <p className="text-xs mt-0.5 font-medium" style={{ color }}>
            {label}
          </p>
        </div>
      )}
    </div>
  )
}
