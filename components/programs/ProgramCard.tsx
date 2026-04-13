"use client"

import { useRouter } from "next/navigation"
import { Clock, Users, ArrowRight, Loader2 } from "lucide-react"
import ProgramProgress from "./ProgramProgress"

interface ProgramCardProps {
  slug: string
  name: string
  description: string
  durationWeeks: number
  difficulty: "beginner" | "intermediate" | "advanced"
  enrollmentCount: number
  enrolled: boolean
  progress: number
  onEnroll: () => void
  enrollDisabled: boolean
}

const difficultyColor = {
  beginner: "bg-[#14B8A6]/20 text-[#14B8A6]",
  intermediate: "bg-[#F59E0B]/20 text-[#F59E0B]",
  advanced: "bg-[#EF4444]/20 text-[#EF4444]",
}

export default function ProgramCard({
  slug,
  name,
  description,
  durationWeeks,
  difficulty,
  enrollmentCount,
  enrolled,
  progress,
  onEnroll,
  enrollDisabled,
}: ProgramCardProps) {
  const router = useRouter()

  return (
    <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
            {name}
          </h3>

          {/* Meta badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${difficultyColor[difficulty]}`}
            >
              {difficulty}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
              <Clock className="w-3 h-3" />
              {durationWeeks} weeks
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
              <Users className="w-3 h-3" />
              {enrollmentCount}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Progress ring if enrolled */}
        {enrolled && (
          <div className="shrink-0">
            <ProgramProgress percentage={progress} size={56} />
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="mt-4">
        {enrolled ? (
          <button
            onClick={() => router.push(`/programs/${slug}`)}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onEnroll}
            disabled={enrollDisabled}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-[#3B82F6] text-[#3B82F6] text-sm font-medium hover:bg-[#3B82F6]/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            Start Program
          </button>
        )}
      </div>
    </div>
  )
}
