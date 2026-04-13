"use client"

import { Lightbulb } from "lucide-react"

interface JournalPromptProps {
  prompt: string
  loading?: boolean
}

export default function JournalPrompt({ prompt, loading }: JournalPromptProps) {
  if (loading) {
    return (
      <div className="rounded-xl border-l-4 border-[#14B8A6] bg-[#1E293B] p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-32 rounded bg-[#334155]" />
          <div className="h-4 w-full rounded bg-[#334155]" />
          <div className="h-4 w-3/4 rounded bg-[#334155]" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border-l-4 border-[#14B8A6] bg-[#1E293B] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-[#14B8A6]" />
        <span className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wide">
          Today&apos;s Prompt
        </span>
      </div>
      <p className="text-sm text-[#CBD5E1] italic leading-relaxed">
        {prompt}
      </p>
    </div>
  )
}
