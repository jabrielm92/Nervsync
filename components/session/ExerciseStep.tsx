"use client"

import SessionTimer from "@/components/session/SessionTimer"

interface Exercise {
  name: string
  description?: string
  instructions?: string
  durationSeconds: number
}

interface ExerciseStepProps {
  exercise: Exercise
  isPlaying: boolean
  onComplete: () => void
}

export default function ExerciseStep({
  exercise,
  isPlaying,
  onComplete,
}: ExerciseStepProps) {
  // Parse instructions into steps - support numbered lines or newlines
  const steps = exercise.instructions
    ? exercise.instructions
        .split(/\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => s.replace(/^\d+[\.\)]\s*/, ""))
    : []

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-8">
      {/* Exercise name */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">
          {exercise.name}
        </h2>
        {exercise.description && (
          <p className="text-[#94A3B8] text-sm max-w-sm">
            {exercise.description}
          </p>
        )}
      </div>

      {/* Timer */}
      <SessionTimer
        durationSeconds={exercise.durationSeconds}
        onComplete={onComplete}
        isPlaying={isPlaying}
      />

      {/* Step-by-step instructions */}
      {steps.length > 0 && (
        <div className="w-full max-w-sm space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center">
                <span className="text-xs font-semibold text-[#94A3B8]">
                  {i + 1}
                </span>
              </div>
              <p className="text-[#CBD5E1] text-sm leading-relaxed pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
