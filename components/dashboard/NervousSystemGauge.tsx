"use client"

import { useEffect, useState } from "react"

interface NervousSystemGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
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

export default function NervousSystemGauge({
  score,
  size = 160,
  strokeWidth = 12,
}: NervousSystemGaugeProps) {
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
    <div className="flex flex-col items-center gap-2">
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
            }}
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-[#94A3B8]">Regulation Score</p>
        <p className="text-xs mt-0.5" style={{ color }}>
          {label}
        </p>
      </div>
    </div>
  )
}
