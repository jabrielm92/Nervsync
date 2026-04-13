"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Loader2 } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import ProgramCard from "@/components/programs/ProgramCard"

interface Program {
  id: string
  slug: string
  name: string
  description: string
  durationWeeks: number
  difficulty: "beginner" | "intermediate" | "advanced"
  enrollmentCount: number
  enrolled: boolean
  progress: number // 0-100
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollingSlug, setEnrollingSlug] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programs")
        if (res.ok) {
          const data = await res.json()
          setPrograms(data.programs ?? [])
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  const handleEnroll = async (slug: string) => {
    if (enrollingSlug) return
    setEnrollingSlug(slug)
    try {
      const res = await fetch(`/api/programs/${slug}/enroll`, {
        method: "POST",
      })
      if (res.ok) {
        setPrograms((prev) =>
          prev.map((p) =>
            p.slug === slug
              ? { ...p, enrolled: true, progress: 0, enrollmentCount: p.enrollmentCount + 1 }
              : { ...p, enrolled: false }
          )
        )
      }
    } catch {
      // silently fail
    } finally {
      setEnrollingSlug(null)
    }
  }

  const hasActiveProgram = programs.some((p) => p.enrolled)

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AppHeader title="Programs" />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-[#94A3B8] mb-6">
          Structured multi-week programs to build nervous system resilience.
          {hasActiveProgram &&
            " You can only be enrolled in one program at a time."}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GraduationCap className="w-10 h-10 text-[#334155] mb-3" />
            <p className="text-sm text-[#64748B]">
              No programs available yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                slug={program.slug}
                name={program.name}
                description={program.description}
                durationWeeks={program.durationWeeks}
                difficulty={program.difficulty}
                enrollmentCount={program.enrollmentCount}
                enrolled={program.enrolled}
                progress={program.progress}
                onEnroll={() => handleEnroll(program.slug)}
                enrollDisabled={
                  (hasActiveProgram && !program.enrolled) ||
                  enrollingSlug !== null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
