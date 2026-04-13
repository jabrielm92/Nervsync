"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Zap, Cloud, Link, BatteryLow, Leaf, ChevronLeft } from "lucide-react"
import LoadingBreath from "@/components/shared/LoadingBreath"

// --------------- Types ---------------

type NervousState = "fight_flight" | "freeze" | "fawn" | "dorsal_collapse" | "ventral_vagal"

interface StateOption {
  id: NervousState
  label: string
  description: string
  icon: typeof Zap
  gradientFrom: string
  gradientTo: string
}

const STATES: StateOption[] = [
  {
    id: "fight_flight",
    label: "Wired & On Edge",
    description: "Racing thoughts, tight chest, can't settle",
    icon: Zap,
    gradientFrom: "#F59E0B",
    gradientTo: "#F97316",
  },
  {
    id: "freeze",
    label: "Foggy & Stuck",
    description: "Brain fog, numb, zoned out, disconnected",
    icon: Cloud,
    gradientFrom: "#64748B",
    gradientTo: "#3B82F6",
  },
  {
    id: "fawn",
    label: "Over-Giving & Tense",
    description: "Monitoring others, can't say no, drained",
    icon: Link,
    gradientFrom: "#F43F5E",
    gradientTo: "#EC4899",
  },
  {
    id: "dorsal_collapse",
    label: "Drained & Low",
    description: "No energy, heavy, want to hide",
    icon: BatteryLow,
    gradientFrom: "#6366F1",
    gradientTo: "#7C3AED",
  },
  {
    id: "ventral_vagal",
    label: "Calm & Grounded",
    description: "Present, open, steady, connected",
    icon: Leaf,
    gradientFrom: "#14B8A6",
    gradientTo: "#10B981",
  },
]

const INTENSITY_LABELS = [
  "Barely there",
  "Noticeable",
  "Moderate",
  "Strong",
  "Overwhelming",
]

const CONTEXT_TAGS = [
  "Work",
  "Relationships",
  "Health",
  "Money",
  "Family",
  "News",
  "Sleep",
  "Unknown",
  "Nothing specific",
]

const PHYSICAL_SYMPTOMS = [
  "Chest tight",
  "Jaw clenched",
  "Stomach knots",
  "Headache",
  "Shallow breathing",
  "Shoulders up",
  "Restless",
  "Numb",
]

// --------------- Component ---------------

export default function CheckinPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1
  const [selectedState, setSelectedState] = useState<NervousState | null>(null)
  // Step 2
  const [intensity, setIntensity] = useState<number | null>(null)
  // Step 3
  const [contextTags, setContextTags] = useState<string[]>([])
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)
  // Step 4
  const [error, setError] = useState<string | null>(null)

  // Animation direction: 1 forward, -1 back
  const [direction, setDirection] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  const animateStep = useCallback(
    (nextStep: number) => {
      setDirection(nextStep > step ? 1 : -1)
      setIsAnimating(true)
      setTimeout(() => {
        setStep(nextStep)
        setIsAnimating(false)
      }, 200)
    },
    [step]
  )

  const handleStateSelect = (state: NervousState) => {
    setSelectedState(state)
    setTimeout(() => animateStep(2), 180)
  }

  const handleIntensitySelect = (value: number) => {
    setIntensity(value)
    setTimeout(() => animateStep(3), 180)
  }

  const toggleTag = (tag: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag])
  }

  const handleContextContinue = () => {
    animateStep(4)
    submitCheckin()
  }

  const handleSkip = () => {
    animateStep(4)
    submitCheckin()
  }

  const submitCheckin = async () => {
    setError(null)
    try {
      // 1. POST checkin
      const checkinRes = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryState: selectedState,
          intensity,
          physicalSymptoms: symptoms,
          contextTags,
          energyLevel,
          sleepQuality,
        }),
      })

      if (!checkinRes.ok) {
        throw new Error("Failed to save check-in")
      }

      const checkin = await checkinRes.json()

      // 2. POST session generate
      const sessionRes = await fetch("/api/session/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinId: checkin.id }),
      })

      if (!sessionRes.ok) {
        throw new Error("Failed to generate session")
      }

      const session = await sessionRes.json()

      // 3. Redirect to session
      router.push(`/session?sessionId=${session.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      // Go back to step 3 so user can retry
      setStep(3)
    }
  }

  // Animation style
  const contentStyle: React.CSSProperties = isAnimating
    ? {
        opacity: 0,
        transform: `translateY(${direction * 20}px)`,
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }
    : {
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* Top bar: step dots + back */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {step > 1 && step < 4 ? (
          <button
            onClick={() => animateStep(step - 1)}
            className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center active:bg-[#334155] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-[#94A3B8]" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {/* Step dots */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "bg-[#3B82F6] w-6"
                  : s < step
                    ? "bg-[#14B8A6]"
                    : "bg-[#334155]"
              }`}
            />
          ))}
        </div>

        <div className="w-10" />
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto" style={contentStyle}>
        {/* --------- Step 1: State Selection --------- */}
        {step === 1 && (
          <div className="max-w-md mx-auto pt-4">
            <h1 className="text-xl font-bold text-[#F8FAFC] text-center mb-1">
              How does your nervous system feel right now?
            </h1>
            <p className="text-sm text-[#94A3B8] text-center mb-6">
              Tap the one that fits best
            </p>

            <div className="space-y-3">
              {STATES.map((state) => {
                const Icon = state.icon
                const isSelected = selectedState === state.id
                return (
                  <button
                    key={state.id}
                    onClick={() => handleStateSelect(state.id)}
                    className="w-full text-left rounded-2xl p-4 transition-all duration-200 active:scale-[0.97]"
                    style={{
                      background: `linear-gradient(135deg, ${state.gradientFrom}18, ${state.gradientTo}10)`,
                      border: `1.5px solid ${isSelected ? state.gradientFrom : state.gradientFrom + "30"}`,
                      transform: isSelected ? "scale(0.97)" : "scale(1)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${state.gradientFrom}, ${state.gradientTo})`,
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#F8FAFC]">
                          {state.label}
                        </p>
                        <p className="text-sm text-[#94A3B8] mt-0.5">
                          {state.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* --------- Step 2: Intensity --------- */}
        {step === 2 && (
          <div className="max-w-md mx-auto pt-8 flex flex-col items-center">
            <h1 className="text-xl font-bold text-[#F8FAFC] text-center mb-2">
              How strong is this feeling?
            </h1>
            <p className="text-sm text-[#94A3B8] text-center mb-10">
              {selectedState && STATES.find((s) => s.id === selectedState)?.label}
            </p>

            <div className="flex gap-3 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((level) => {
                const isSelected = intensity === level
                const stateColor =
                  STATES.find((s) => s.id === selectedState)?.gradientFrom ?? "#3B82F6"
                return (
                  <button
                    key={level}
                    onClick={() => handleIntensitySelect(level)}
                    className="flex flex-col items-center gap-2 transition-all active:scale-90"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                        isSelected
                          ? "text-white scale-110"
                          : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
                      }`}
                      style={
                        isSelected
                          ? { backgroundColor: stateColor }
                          : undefined
                      }
                    >
                      {level}
                    </div>
                    <span className="text-[10px] text-[#64748B] font-medium max-w-[56px] text-center leading-tight">
                      {INTENSITY_LABELS[level - 1]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* --------- Step 3: Context (Optional) --------- */}
        {step === 3 && (
          <div className="max-w-md mx-auto pt-4">
            <h1 className="text-xl font-bold text-[#F8FAFC] text-center mb-1">
              What&apos;s contributing to this?
            </h1>
            <p className="text-sm text-[#94A3B8] text-center mb-6">
              Optional - select all that apply
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
                <button
                  onClick={() => {
                    setError(null)
                    handleContextContinue()
                  }}
                  className="mt-2 w-full text-center text-sm text-[#3B82F6] font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Context tags */}
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Context
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {CONTEXT_TAGS.map((tag) => {
                const selected = contextTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag, contextTags, setContextTags)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* Physical symptoms */}
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Physical Symptoms
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {PHYSICAL_SYMPTOMS.map((symptom) => {
                const selected = symptoms.includes(symptom)
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleTag(symptom, symptoms, setSymptoms)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? "bg-[#14B8A6] text-white"
                        : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
                    }`}
                  >
                    {symptom}
                  </button>
                )
              })}
            </div>

            {/* Energy level */}
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Energy Level
            </p>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setEnergyLevel(level)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    energyLevel === level
                      ? "bg-[#F59E0B] text-white"
                      : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Sleep quality */}
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
              Sleep Quality Last Night
            </p>
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setSleepQuality(level)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    sleepQuality === level
                      ? "bg-[#6366F1] text-white"
                      : "bg-[#1E293B] text-[#94A3B8] border border-[#334155]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-4 rounded-2xl bg-[#1E293B] text-[#94A3B8] font-semibold text-sm border border-[#334155] transition-all active:scale-[0.97]"
              >
                Skip
              </button>
              <button
                onClick={handleContextContinue}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] text-white font-semibold text-sm transition-all active:scale-[0.97]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* --------- Step 4: Loading / Building Protocol --------- */}
        {step === 4 && (
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <LoadingBreath message="Building your protocol..." />
          </div>
        )}
      </div>
    </div>
  )
}
