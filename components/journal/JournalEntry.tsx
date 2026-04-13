"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Brain } from "lucide-react"

interface JournalEntryProps {
  id: string
  date: string
  content: string
  emotionalTone: string | null
  tags: string[]
  aiReflection: string | null
}

const toneColors: Record<string, string> = {
  calm: "bg-[#14B8A6]/20 text-[#14B8A6]",
  anxious: "bg-[#F59E0B]/20 text-[#F59E0B]",
  sad: "bg-[#6366F1]/20 text-[#6366F1]",
  angry: "bg-[#EF4444]/20 text-[#EF4444]",
  hopeful: "bg-[#3B82F6]/20 text-[#3B82F6]",
  grateful: "bg-[#10B981]/20 text-[#10B981]",
  overwhelmed: "bg-[#F97316]/20 text-[#F97316]",
  numb: "bg-[#64748B]/20 text-[#94A3B8]",
}

export default function JournalEntry({
  date,
  content,
  emotionalTone,
  tags,
  aiReflection,
}: JournalEntryProps) {
  const [expanded, setExpanded] = useState(false)

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const preview = content.length > 120 ? content.slice(0, 120) + "..." : content
  const toneClass =
    emotionalTone && toneColors[emotionalTone]
      ? toneColors[emotionalTone]
      : "bg-[#334155] text-[#94A3B8]"

  return (
    <div className="rounded-xl border border-[#334155] bg-[#1E293B] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-[#64748B] font-medium">
                {formattedDate}
              </span>
              {emotionalTone && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${toneClass}`}
                >
                  {emotionalTone}
                </span>
              )}
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              {expanded ? content : preview}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#334155] text-[#94A3B8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-[#64748B] shrink-0 mt-1">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </button>

      {expanded && aiReflection && (
        <div className="px-4 pb-4 border-t border-[#334155]">
          <div className="flex items-center gap-2 mt-3 mb-2">
            <Brain className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wide">
              AI Reflection
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] leading-relaxed italic">
            {aiReflection}
          </p>
        </div>
      )}
    </div>
  )
}
