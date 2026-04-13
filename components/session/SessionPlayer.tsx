"use client"

import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, X, Pause, Play } from "lucide-react"
import BreathingGuide from "@/components/session/BreathingGuide"
import ExerciseStep from "@/components/session/ExerciseStep"
import SessionComplete from "@/components/session/SessionComplete"

interface BreathCues {
  inhale: number
  hold: number
  exhale: number
  holdEmpty: number
}

interface Exercise {
  name: string
  description?: string
  instructions?: string
  durationSeconds: number
  breathCues?: BreathCues
  cycles?: number
}

interface Session {
  id: string
  title: string
  description?: string
  exercises: Exercise[]
}

interface SessionPlayerProps {
  session: Session
  onClose: () => void
}

type TransitionState = "active" | "transitioning" | "complete"

export default function SessionPlayer({
  session,
  onClose,
}: SessionPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [transitionState, setTransitionState] = useState<TransitionState>("active")
  const [slideDir, setSlideDir] = useState<"left" | "right">("left")

  const exercises = session.exercises
  const totalExercises = exercises.length
  const currentExercise = exercises[currentIndex]

  const goToNext = useCallback(() => {
    if (currentIndex >= totalExercises - 1) {
      // Last exercise done
      setTransitionState("complete")
      return
    }

    setSlideDir("left")
    setTransitionState("transitioning")

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsPlaying(true)
      setTransitionState("active")
    }, 600)
  }, [currentIndex, totalExercises])

  const goToPrev = useCallback(() => {
    if (currentIndex <= 0) return
    setSlideDir("right")
    setTransitionState("transitioning")

    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1)
      setIsPlaying(true)
      setTransitionState("active")
    }, 600)
  }, [currentIndex])

  const handleExerciseComplete = useCallback(() => {
    goToNext()
  }, [goToNext])

  // Session complete screen
  if (transitionState === "complete") {
    return (
      <SessionComplete
        sessionId={session.id}
        exerciseCount={totalExercises}
      />
    )
  }

  // Progress fraction
  const progress = totalExercises > 0 ? (currentIndex + 1) / totalExercises : 0

  // Transition overlay
  if (transitionState === "transitioning") {
    return (
      <div className="fixed inset-0 bg-[#0F172A] z-50 flex flex-col items-center justify-center">
        <div
          className="text-center"
          style={{ animation: "fadeSlideUp 0.5s ease-out both" }}
        >
          <p className="text-[#94A3B8] text-sm mb-2">Up next</p>
          <p className="text-xl font-semibold text-[#F8FAFC]">
            {slideDir === "left"
              ? exercises[currentIndex + 1]?.name ?? "Complete"
              : exercises[currentIndex - 1]?.name ?? ""}
          </p>
        </div>

        <style jsx>{`
          @keyframes fadeSlideUp {
            0% { transform: translateY(12px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#0F172A] z-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 safe-top">
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center transition-colors active:bg-[#334155]"
          aria-label="Close session"
        >
          <X className="w-5 h-5 text-[#94A3B8]" />
        </button>

        {/* Step indicator */}
        <p className="text-sm text-[#94A3B8] font-medium">
          {currentIndex + 1} / {totalExercises}
        </p>

        {/* Play/pause */}
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center transition-colors active:bg-[#334155]"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-[#94A3B8]" />
          ) : (
            <Play className="w-5 h-5 text-[#94A3B8] ml-0.5" />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-4">
        <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise content */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center">
        {currentExercise?.breathCues ? (
          <div className="flex flex-col items-center gap-4 px-6">
            <h2 className="text-xl font-bold text-[#F8FAFC] text-center">
              {currentExercise.name}
            </h2>
            {currentExercise.description && (
              <p className="text-[#94A3B8] text-sm text-center max-w-sm">
                {currentExercise.description}
              </p>
            )}
            <BreathingGuide
              key={currentIndex}
              breathCues={currentExercise.breathCues}
              cycles={currentExercise.cycles ?? 6}
              onComplete={handleExerciseComplete}
            />
          </div>
        ) : (
          <ExerciseStep
            key={currentIndex}
            exercise={currentExercise}
            isPlaying={isPlaying}
            onComplete={handleExerciseComplete}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-6 pb-6 pt-4 safe-bottom">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30 text-[#94A3B8] active:bg-[#1E293B]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={goToNext}
          className="flex items-center gap-1 px-6 py-3 rounded-xl bg-[#3B82F6] text-white text-sm font-semibold transition-all active:scale-[0.97]"
        >
          {currentIndex >= totalExercises - 1 ? "Finish" : "Next"}
          {currentIndex < totalExercises - 1 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
