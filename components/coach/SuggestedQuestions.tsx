"use client"

import { Sparkles } from "lucide-react"

const suggestions = [
  "Why do I feel wired but tired?",
  "What does my check-in pattern mean?",
  "Help me understand my freeze response",
  "What should I do differently this week?",
  "Explain polyvagal theory simply",
]

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
}

export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#3B82F6]/10 mb-4">
        <Sparkles className="w-7 h-7 text-[#3B82F6]" />
      </div>
      <h2 className="text-lg font-semibold text-[#F8FAFC] mb-1">
        NervSync Coach
      </h2>
      <p className="text-sm text-[#94A3B8] mb-6 text-center max-w-xs">
        Ask me anything about your nervous system, patterns, or what to do next.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="text-left px-4 py-3 rounded-xl border border-[#334155] bg-[#1E293B]/60 text-sm text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#F8FAFC] hover:border-[#3B82F6]/40 transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
