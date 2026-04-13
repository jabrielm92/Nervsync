"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Heart, ArrowRight, Home, Shield } from "lucide-react"

type SOSPhase = "breathing" | "grounding" | "complete" | "extended"

const GROUNDING_PROMPTS = [
  { count: 5, sense: "see", text: "Name 5 things you can see" },
  { count: 4, sense: "touch", text: "Name 4 things you can touch" },
  { count: 3, sense: "hear", text: "Name 3 things you can hear" },
  { count: 2, sense: "smell", text: "Name 2 things you can smell" },
  { count: 1, sense: "taste", text: "Name 1 thing you can taste" },
]

export default function SOSPage() {
  const [phase, setPhase] = useState<SOSPhase>("breathing")
  const [breathStep, setBreathStep] = useState<
    "inhale1" | "inhale2" | "exhale" | "rest"
  >("inhale1")
  const [breathTimer, setBreathTimer] = useState(3)
  const [breathCycle, setBreathCycle] = useState(1)
  const [breathElapsed, setBreathElapsed] = useState(0)
  const [groundingIndex, setGroundingIndex] = useState(0)
  const [groundingTimer, setGroundingTimer] = useState(15)
  const [extendedTimer, setExtendedTimer] = useState(300)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Log SOS session on mount
  useEffect(() => {
    async function logSOS() {
      try {
        const res = await fetch("/api/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startedAt: new Date().toISOString() }),
        })
        if (res.ok) {
          const data = await res.json()
          setSessionId(data.id ?? null)
        }
      } catch {
        // don't let API failure block the experience
      }
    }
    logSOS()
  }, [])

  // Physiological Sigh breathing (double inhale + long exhale)
  // inhale1: 3s, inhale2(hold slot): 1s deep inhale, exhale: 6s
  // Total cycle ~10s, 6 cycles = ~60s
  const advanceBreath = useCallback(() => {
    setBreathStep((prev) => {
      switch (prev) {
        case "inhale1":
          setBreathTimer(1)
          return "inhale2"
        case "inhale2":
          setBreathTimer(6)
          return "exhale"
        case "exhale":
          setBreathCycle((c) => {
            if (c >= 6) {
              // transition to grounding after 6 cycles
              setPhase("grounding")
              return c
            }
            return c + 1
          })
          setBreathTimer(3)
          return "inhale1"
        default:
          return prev
      }
    })
  }, [])

  // Breathing timer
  useEffect(() => {
    if (phase !== "breathing" && phase !== "extended") return

    if (phase === "extended") {
      // Extended mode: simple gentle breathing (4-7-8)
      timerRef.current = setInterval(() => {
        setExtendedTimer((prev) => {
          if (prev <= 1) {
            setPhase("complete")
            return 0
          }
          return prev - 1
        })
        setBreathElapsed((prev) => prev + 1)

        setBreathTimer((prev) => {
          if (prev <= 1) {
            advanceBreath()
            return prev
          }
          return prev - 1
        })
      }, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }

    timerRef.current = setInterval(() => {
      setBreathElapsed((prev) => prev + 1)
      setBreathTimer((prev) => {
        if (prev <= 1) {
          advanceBreath()
          return prev
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, advanceBreath])

  // Grounding timer
  useEffect(() => {
    if (phase !== "grounding") return

    timerRef.current = setInterval(() => {
      setGroundingTimer((prev) => {
        if (prev <= 1) {
          setGroundingIndex((gi) => {
            if (gi >= GROUNDING_PROMPTS.length - 1) {
              setPhase("complete")
              return gi
            }
            return gi + 1
          })
          return 15
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  const getBreathLabel = () => {
    switch (breathStep) {
      case "inhale1":
        return "Short inhale..."
      case "inhale2":
        return "Deeper inhale..."
      case "exhale":
        return "Long slow exhale..."
      default:
        return ""
    }
  }

  const getBreathScale = () => {
    switch (breathStep) {
      case "inhale1":
        return 0.7
      case "inhale2":
        return 1.0
      case "exhale":
        return 0.5
      default:
        return 0.6
    }
  }

  const getBreathDuration = () => {
    switch (breathStep) {
      case "inhale1":
        return 3
      case "inhale2":
        return 1
      case "exhale":
        return 6
      default:
        return 3
    }
  }

  const handleKeepGoing = () => {
    setPhase("extended")
    setBreathStep("inhale1")
    setBreathTimer(3)
    setBreathCycle(1)
  }

  const handleImOkay = async () => {
    // Log completion
    try {
      if (sessionId) {
        await fetch(`/api/sos/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completedAt: new Date().toISOString() }),
        })
      }
    } catch {
      // non-blocking
    }
    window.location.href = "/dashboard"
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col items-center justify-center px-6">
      {/* Breathing phase */}
      {(phase === "breathing" || phase === "extended") && (
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm">
          {/* Calming header text */}
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-5 h-5 text-[#14B8A6]" />
            <p className="text-[#94A3B8] text-sm">
              {phase === "extended" ? "Gentle session" : "SOS Mode"}
            </p>
          </div>

          <p className="text-xl md:text-2xl font-light text-[#F8FAFC] text-center mb-12 leading-relaxed">
            I&apos;m here. Let&apos;s regulate together.
          </p>

          {/* Breathing circle */}
          <div className="relative flex items-center justify-center w-[220px] h-[220px] mb-10">
            {/* Outer glow */}
            <div
              className="absolute rounded-full bg-gradient-to-br from-[#14B8A6]/10 to-[#3B82F6]/10"
              style={{
                width: 220,
                height: 220,
                transform: `scale(${getBreathScale()})`,
                transition: `transform ${getBreathDuration()}s ease-in-out`,
              }}
            />
            {/* Main circle */}
            <div
              className="rounded-full bg-gradient-to-br from-[#14B8A6] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#14B8A6]/20"
              style={{
                width: 200,
                height: 200,
                transform: `scale(${getBreathScale()})`,
                transition: `transform ${getBreathDuration()}s ease-in-out`,
              }}
            >
              <span className="text-white text-4xl font-light tabular-nums">
                {breathTimer}
              </span>
            </div>
          </div>

          {/* Breath instruction */}
          <p className="text-lg text-[#F8FAFC] font-medium mb-2">
            {getBreathLabel()}
          </p>
          <p className="text-sm text-[#64748B]">
            {phase === "extended"
              ? `${Math.floor(extendedTimer / 60)}:${(extendedTimer % 60)
                  .toString()
                  .padStart(2, "0")} remaining`
              : `Cycle ${breathCycle} of 6`}
          </p>
        </div>
      )}

      {/* Grounding phase */}
      {phase === "grounding" && (
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm text-center">
          <p className="text-sm text-[#14B8A6] uppercase tracking-wider font-semibold mb-4">
            5-4-3-2-1 Grounding
          </p>

          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#14B8A6]/10 mb-8">
            <span className="text-3xl font-bold text-[#14B8A6]">
              {GROUNDING_PROMPTS[groundingIndex].count}
            </span>
          </div>

          <p className="text-xl md:text-2xl font-light text-[#F8FAFC] leading-relaxed mb-6">
            {GROUNDING_PROMPTS[groundingIndex].text}
          </p>

          <p className="text-sm text-[#64748B]">
            Take your time... {groundingTimer}s
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-8">
            {GROUNDING_PROMPTS.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i <= groundingIndex ? "bg-[#14B8A6]" : "bg-[#334155]"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Complete phase */}
      {phase === "complete" && (
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#14B8A6]/10 mb-6">
            <Heart className="w-8 h-8 text-[#14B8A6]" />
          </div>

          <p className="text-xl md:text-2xl font-light text-[#F8FAFC] leading-relaxed mb-2">
            You did great.
          </p>
          <p className="text-sm text-[#94A3B8] mb-10">
            Your nervous system is settling. How do you feel?
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleKeepGoing}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-[#14B8A6] text-[#14B8A6] text-sm font-medium hover:bg-[#14B8A6]/10 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Keep going
            </button>
            <button
              onClick={handleImOkay}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#14B8A6] text-white text-sm font-medium hover:bg-[#0D9488] transition-colors"
            >
              <Home className="w-4 h-4" />
              I&apos;m okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
