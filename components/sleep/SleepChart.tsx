"use client"

interface SleepDataPoint {
  date: string
  score: number
}

interface SleepChartProps {
  data: SleepDataPoint[]
}

export default function SleepChart({ data }: SleepChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl border border-[#334155] bg-[#1E293B]">
        <p className="text-sm text-[#64748B]">No sleep data yet</p>
      </div>
    )
  }

  const maxScore = 5
  const chartHeight = 160
  const barWidth = 100 / data.length
  const barGap = 2

  return (
    <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4">
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4">
        Sleep Score - Last 30 Days
      </h3>
      <svg
        viewBox={`0 0 ${data.length * 20} ${chartHeight + 20}`}
        className="w-full h-40"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((line) => (
          <line
            key={line}
            x1="0"
            y1={chartHeight - (line / maxScore) * chartHeight}
            x2={data.length * 20}
            y2={chartHeight - (line / maxScore) * chartHeight}
            stroke="#334155"
            strokeWidth="0.5"
          />
        ))}

        {/* Bars */}
        {data.map((point, i) => {
          const barHeight = (point.score / maxScore) * chartHeight
          const x = i * 20 + barGap / 2
          const y = chartHeight - barHeight

          const color =
            point.score >= 4
              ? "#14B8A6"
              : point.score >= 3
              ? "#3B82F6"
              : point.score >= 2
              ? "#F59E0B"
              : "#EF4444"

          return (
            <g key={point.date}>
              <rect
                x={x}
                y={y}
                width={20 - barGap}
                height={barHeight}
                rx="2"
                fill={color}
                opacity="0.85"
              />
              {/* Date label for every 7th day */}
              {i % 7 === 0 && (
                <text
                  x={x + (20 - barGap) / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="6"
                >
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {[
          { label: "Great", color: "#14B8A6" },
          { label: "Good", color: "#3B82F6" },
          { label: "Fair", color: "#F59E0B" },
          { label: "Poor", color: "#EF4444" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-[#64748B]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
