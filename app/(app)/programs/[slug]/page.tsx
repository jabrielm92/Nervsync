"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  Loader2,
  Users,
  Clock,
} from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import ProgramProgress from "@/components/programs/ProgramProgress"

interface ProgramDay {
  day: number
  title: string
  description: string
  completed: boolean
  current: boolean
}

interface ProgramDetail {
  id: string
  slug: string
  name: string
  description: string
  targetAudience: string
  durationWeeks: number
  difficulty: "beginner" | "intermediate" | "advanced"
  enrollmentCount: number
  enrolled: boolean
  progress: number
  days: ProgramDay[]
}

export default function ProgramDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [program, setProgram] = useState<ProgramDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await fetch(`/api/programs/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setProgram(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchProgram()
  }, [slug])

  const currentDay = program?.days.find((d) => d.current)

  const handleStartModule = () => {
    if (currentDay) {
      router.push(`/session?program=${slug}&day=${currentDay.day}`)
    }
  }

  const difficultyColor = {
    beginner: "bg-[#14B8A6]/20 text-[#14B8A6]",
    intermediate: "bg-[#F59E0B]/20 text-[#F59E0B]",
    advanced: "bg-[#EF4444]/20 text-[#EF4444]",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <AppHeader title="Program" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <AppHeader title="Program" />
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-sm text-[#64748B]">Program not found.</p>
          <button
            onClick={() => router.push("/programs")}
            className="mt-4 text-sm text-[#3B82F6] hover:underline"
          >
            Back to programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AppHeader title={program.name} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Back link */}
        <button
          onClick={() => router.push("/programs")}
          className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Programs
        </button>

        {/* Header card */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                    difficultyColor[program.difficulty]
                  }`}
                >
                  {program.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
                  <Clock className="w-3 h-3" />
                  {program.durationWeeks} weeks
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
                  <Users className="w-3 h-3" />
                  {program.enrollmentCount} enrolled
                </span>
              </div>
              <p className="text-sm text-[#CBD5E1] leading-relaxed mb-2">
                {program.description}
              </p>
              {program.targetAudience && (
                <p className="text-xs text-[#64748B]">
                  <span className="font-semibold">For:</span>{" "}
                  {program.targetAudience}
                </p>
              )}
            </div>

            {program.enrolled && (
              <div className="shrink-0">
                <ProgramProgress percentage={program.progress} size={64} />
              </div>
            )}
          </div>

          {/* Overall progress bar */}
          {program.enrolled && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
                <span>Progress</span>
                <span>{program.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#334155] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] transition-all duration-500"
                  style={{ width: `${program.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Start Today's Module */}
        {program.enrolled && currentDay && (
          <button
            onClick={handleStartModule}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Today&apos;s Module: Day {currentDay.day}
          </button>
        )}

        {/* Day-by-day modules */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wide">
            Modules
          </h3>
          <div className="space-y-2">
            {program.days.map((day) => (
              <div
                key={day.day}
                className={`rounded-xl border p-4 transition-colors ${
                  day.current
                    ? "border-[#3B82F6] bg-[#3B82F6]/5"
                    : "border-[#334155] bg-[#1E293B]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {day.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />
                    ) : day.current ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#3B82F6] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-[#334155]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#64748B] font-medium">
                        Day {day.day}
                      </span>
                      {day.current && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] uppercase">
                          Today
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium mt-0.5 ${
                        day.completed
                          ? "text-[#94A3B8] line-through"
                          : "text-[#F8FAFC]"
                      }`}
                    >
                      {day.title}
                    </p>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {day.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
