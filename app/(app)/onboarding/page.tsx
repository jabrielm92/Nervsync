"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Zap,
  ShieldCheck,
  Moon,
  Battery,
  Brain,
  Heart,
  Clock,
  Sunrise,
  Sunset,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react"

type Goal = "stress" | "sleep" | "energy" | "focus" | "emotional_resilience"

interface OnboardingData {
  name: string
  primaryGoal: Goal | null
  preferredDuration: number | null
  wakeTime: string
  bedTime: string
}

const goals: { id: Goal; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "stress", label: "Reduce stress", icon: ShieldCheck },
  { id: "sleep", label: "Better sleep", icon: Moon },
  { id: "energy", label: "More energy", icon: Battery },
  { id: "focus", label: "Sharper focus", icon: Brain },
  { id: "emotional_resilience", label: "Emotional resilience", icon: Heart },
]

const durations = [
  { minutes: 5, label: "5 min", description: "Quick regulation" },
  { minutes: 10, label: "10 min", description: "Recommended" },
  { minutes: 15, label: "15 min", description: "Deeper practice" },
  { minutes: 20, label: "20 min", description: "Full session" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    name: "",
    primaryGoal: null,
    preferredDuration: null,
    wakeTime: "07:00",
    bedTime: "22:00",
  })

  const totalSteps = 5

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return data.name.trim().length > 0
      case 1:
        return data.primaryGoal !== null
      case 2:
        return data.preferredDuration !== null
      case 3:
        return data.wakeTime !== "" && data.bedTime !== ""
      case 4:
        return true
      default:
        return false
    }
  }

  function handleNext() {
    if (step < totalSteps - 1 && canProceed()) {
      setStep((s) => s + 1)
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((s) => s - 1)
    }
  }

  async function handleComplete() {
    setSaving(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          primaryGoal: data.primaryGoal,
          preferredDuration: data.preferredDuration,
          wakeTime: data.wakeTime,
          bedTime: data.bedTime,
        }),
      })
      if (res.ok) {
        router.push("/dashboard")
      } else {
        setSaving(false)
      }
    } catch {
      setSaving(false)
    }
  }

  const goalLabel = goals.find((g) => g.id === data.primaryGoal)?.label ?? ""
  const durationLabel = durations.find((d) => d.minutes === data.preferredDuration)?.label ?? ""

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-[#F8FAFC]">
      {/* Header */}
      <div className="border-b border-[#1E293B] px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-center">
          <Zap className="h-5 w-5 text-[#3B82F6]" />
          <span className="ml-2 font-bold">NervSync</span>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 px-4 py-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === step
                ? "w-8 bg-[#3B82F6]"
                : i < step
                ? "bg-[#14B8A6]"
                : "bg-[#334155]"
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Step 1: Welcome / Name */}
          {step === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-bold">Welcome to NervSync</h1>
              <p className="mt-3 text-[#94A3B8]">Let&apos;s personalize your experience.</p>
              <div className="mt-10">
                <label className="block text-left text-sm font-medium text-[#94A3B8]">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Your first name"
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3 text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Step 2: Primary Goal */}
          {step === 1 && (
            <div>
              <h2 className="text-center text-2xl font-bold">What&apos;s your primary goal?</h2>
              <p className="mt-2 text-center text-[#94A3B8]">
                This helps us tailor your protocols.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {goals.map((goal) => {
                  const Icon = goal.icon
                  const isSelected = data.primaryGoal === goal.id
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setData({ ...data, primaryGoal: goal.id })}
                      className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-[#3B82F6] bg-[#3B82F6]/10"
                          : "border-[#334155] bg-[#1E293B] hover:border-[#3B82F6]/50"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          isSelected ? "text-[#3B82F6]" : "text-[#94A3B8]"
                        }`}
                      />
                      <span className="font-medium">{goal.label}</span>
                      {isSelected && <Check className="ml-auto h-5 w-5 text-[#3B82F6]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Session Duration */}
          {step === 2 && (
            <div>
              <h2 className="text-center text-2xl font-bold">
                How long for your daily sessions?
              </h2>
              <p className="mt-2 text-center text-[#94A3B8]">
                You can always adjust this later.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {durations.map((d) => {
                  const isSelected = data.preferredDuration === d.minutes
                  return (
                    <button
                      key={d.minutes}
                      onClick={() => setData({ ...data, preferredDuration: d.minutes })}
                      className={`flex flex-col items-center rounded-xl border px-4 py-5 transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-[#3B82F6] bg-[#3B82F6]/10"
                          : "border-[#334155] bg-[#1E293B] hover:border-[#3B82F6]/50"
                      }`}
                    >
                      <Clock
                        className={`h-6 w-6 ${
                          isSelected ? "text-[#3B82F6]" : "text-[#94A3B8]"
                        }`}
                      />
                      <span className="mt-2 text-lg font-bold">{d.label}</span>
                      <span className="mt-0.5 text-xs text-[#94A3B8]">{d.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Wake/Bed Time */}
          {step === 3 && (
            <div>
              <h2 className="text-center text-2xl font-bold">Your daily schedule</h2>
              <p className="mt-2 text-center text-[#94A3B8]">
                This helps us time your protocols.
              </p>
              <div className="mt-8 space-y-6">
                <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5">
                  <div className="flex items-center gap-3">
                    <Sunrise className="h-5 w-5 text-[#F59E0B]" />
                    <label className="text-sm font-medium">Wake time</label>
                  </div>
                  <input
                    type="time"
                    value={data.wakeTime}
                    onChange={(e) => setData({ ...data, wakeTime: e.target.value })}
                    className="mt-3 w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-[#F8FAFC] outline-none focus:border-[#3B82F6] [color-scheme:dark]"
                  />
                </div>
                <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5">
                  <div className="flex items-center gap-3">
                    <Sunset className="h-5 w-5 text-[#8B5CF6]" />
                    <label className="text-sm font-medium">Bed time</label>
                  </div>
                  <input
                    type="time"
                    value={data.bedTime}
                    onChange={(e) => setData({ ...data, bedTime: e.target.value })}
                    className="mt-3 w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-[#F8FAFC] outline-none focus:border-[#3B82F6] [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 4 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold">You&apos;re all set!</h2>
              <p className="mt-3 text-[#94A3B8]">
                Here&apos;s a summary of your preferences.
              </p>
              <div className="mt-8 rounded-xl border border-[#334155] bg-[#1E293B] p-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                    <span className="text-sm text-[#94A3B8]">Name</span>
                    <span className="font-medium">{data.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                    <span className="text-sm text-[#94A3B8]">Primary goal</span>
                    <span className="font-medium">{goalLabel}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                    <span className="text-sm text-[#94A3B8]">Session length</span>
                    <span className="font-medium">{durationLabel}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                    <span className="text-sm text-[#94A3B8]">Wake time</span>
                    <span className="font-medium">{data.wakeTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#94A3B8]">Bed time</span>
                    <span className="font-medium">{data.bedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-[#1E293B] px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/25 hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#14B8A6]/25 hover:bg-[#0D9488] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </span>
              ) : (
                <>
                  Start My Journey
                  <Zap className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
