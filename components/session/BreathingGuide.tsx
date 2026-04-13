"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface BreathCues {
  inhale: number
  hold: number
  exhale: number
  holdEmpty: number
}

interface BreathingGuideProps {
  breathCues: BreathCues
  cycles?: number
  onComplete?: () => void
}

type Phase = "inhale" | "hold" | "exhale" | "holdEmpty"

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Breathe In",
  hold: "Hold",
  exhale: "Breathe Out",
  holdEmpty: "Hold",
}

export default function BreathingGuide({
  breathCues,
  cycles = 6,
  onComplete,
}: BreathingGuideProps) {
  const [currentPhase, setCurrentPhase] = useState<Phase>("inhale")
  const [secondsLeft, setSecondsLeft] = useState(breathCues.inhale)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [isComplete, setIsComplete] = useState(false)
  const [ripples, setRipples] = useState<number[]>([])
  const rippleIdRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPhaseRef = useRef<Phase>("inhale")

  const getPhaseDuration = useCallback(
    (phase: Phase) => {
      switch (phase) {
        case "inhale":
          return breathCues.inhale
        case "hold":
          return breathCues.hold
        case "exhale":
          return breathCues.exhale
        case "holdEmpty":
          return breathCues.holdEmpty
      }
    },
    [breathCues]
  )

  const getNextPhase = useCallback(
    (phase: Phase): { nextPhase: Phase; nextCycle: number; done: boolean } => {
      switch (phase) {
        case "inhale":
          if (breathCues.hold > 0) return { nextPhase: "hold", nextCycle: currentCycle, done: false }
          return { nextPhase: "exhale", nextCycle: currentCycle, done: false }
        case "hold":
          return { nextPhase: "exhale", nextCycle: currentCycle, done: false }
        case "exhale":
          if (breathCues.holdEmpty > 0) return { nextPhase: "holdEmpty", nextCycle: currentCycle, done: false }
          if (currentCycle >= cycles) return { nextPhase: "inhale", nextCycle: currentCycle, done: true }
          return { nextPhase: "inhale", nextCycle: currentCycle + 1, done: false }
        case "holdEmpty":
          if (currentCycle >= cycles) return { nextPhase: "inhale", nextCycle: currentCycle, done: true }
          return { nextPhase: "inhale", nextCycle: currentCycle + 1, done: false }
      }
    },
    [breathCues.hold, breathCues.holdEmpty, currentCycle, cycles]
  )

  const spawnRipple = useCallback(() => {
    const id = rippleIdRef.current++
    setRipples((prev) => [...prev, id])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== id))
    }, 1200)
  }, [])

  // Track phase changes for ripple effect
  useEffect(() => {
    if (currentPhase !== prevPhaseRef.current) {
      spawnRipple()
      prevPhaseRef.current = currentPhase
    }
  }, [currentPhase, spawnRipple])

  useEffect(() => {
    if (isComplete) return

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const { nextPhase, nextCycle, done } = getNextPhase(currentPhase)
          if (done) {
            setIsComplete(true)
            if (timerRef.current) clearInterval(timerRef.current)
            onComplete?.()
            return 0
          }
          setCurrentPhase(nextPhase)
          setCurrentCycle(nextCycle)
          return getPhaseDuration(nextPhase)
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentPhase, currentCycle, isComplete, getNextPhase, getPhaseDuration, onComplete])

  // Calculate scale: 0.5 (120px) to 1.0 (240px) within the 260px container
  const getCircleScale = () => {
    if (isComplete) return 0.5
    const duration = getPhaseDuration(currentPhase)
    const elapsed = duration - secondsLeft
    const progress = duration > 0 ? elapsed / duration : 0

    switch (currentPhase) {
      case "inhale":
        return 0.5 + progress * 0.5
      case "hold":
        return 1.0
      case "exhale":
        return 1.0 - progress * 0.5
      case "holdEmpty":
        return 0.5
    }
  }

  const getTransitionDuration = () => {
    return `${getPhaseDuration(currentPhase)}s`
  }

  const getOpacity = () => {
    if (currentPhase === "hold" || currentPhase === "holdEmpty") return 0.82
    return 1
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <div
          className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#14B8A6] to-[#3B82F6] flex items-center justify-center"
          style={{
            animation: "pulse-gentle 3s ease-in-out infinite",
          }}
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[#94A3B8] text-sm font-medium">Breathing complete</p>
      </div>
    )
  }

  const scale = getCircleScale()

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      {/* Breathing circle container */}
      <div className="relative flex items-center justify-center w-[260px] h-[260px]">
        {/* Concentric guide rings */}
        <div
          className="absolute rounded-full border border-[#14B8A6]/10"
          style={{ width: 240, height: 240 }}
        />
        <div
          className="absolute rounded-full border border-[#14B8A6]/5"
          style={{ width: 180, height: 180 }}
        />

        {/* Ripple rings on phase change */}
        {ripples.map((id) => (
          <div
            key={id}
            className="absolute rounded-full border-2 border-[#14B8A6]/30"
            style={{
              width: 240 * scale,
              height: 240 * scale,
              animation: "ripple 1.2s ease-out forwards",
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* Outer glow */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-[#14B8A6]/10 to-[#3B82F6]/10 blur-sm"
          style={{
            width: 260,
            height: 260,
            transform: `scale(${scale})`,
            transition: `transform ${getTransitionDuration()} ease-in-out`,
            willChange: "transform",
          }}
        />

        {/* Main breathing circle */}
        <div
          className="rounded-full bg-gradient-to-br from-[#14B8A6] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#14B8A6]/20"
          style={{
            width: 240,
            height: 240,
            transform: `scale(${scale})`,
            transition: `transform ${getTransitionDuration()} ease-in-out, opacity 0.4s ease`,
            opacity: getOpacity(),
            willChange: "transform, opacity",
          }}
        >
          {/* Timer inside circle */}
          <span className="text-white text-5xl font-light tabular-nums select-none">
            {secondsLeft}
          </span>
        </div>
      </div>

      {/* Phase label */}
      <div className="text-center">
        <p
          className="text-xl font-semibold text-[#F8FAFC] mb-1 transition-opacity duration-300"
          key={currentPhase + currentCycle}
        >
          {PHASE_LABELS[currentPhase]}
        </p>
        <p className="text-sm text-[#94A3B8]">
          Cycle {currentCycle} of {cycles}
        </p>
      </div>
    </div>
  )
}
