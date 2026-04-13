"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Zap,
  ShieldAlert,
  Snowflake,
  Heart,
  BatteryLow,
  Sun,
  Brain,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react"

type NSState = "fight_flight" | "freeze" | "fawn" | "dorsal_collapse" | "ventral_vagal"

interface StateProfile {
  label: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  borderColor: string
  description: string[]
  benefits: { icon: React.ComponentType<{ className?: string }>; text: string }[]
}

const stateProfiles: Record<NSState, StateProfile> = {
  fight_flight: {
    label: "Fight / Flight",
    icon: ShieldAlert,
    gradient: "from-red-500 to-orange-500",
    borderColor: "border-red-500/30",
    description: [
      "Your nervous system is stuck in overdrive. The sympathetic branch is dominant, keeping you in a constant state of hypervigilance. Your body is scanning for threats even when you're safe, which manifests as racing thoughts, tension, irritability, and difficulty settling down.",
      "This isn't a character flaw -- it's your nervous system doing exactly what it was designed to do in the face of perceived danger. The problem is that it can't tell the difference between a real threat and the chronic stress of modern life.",
      "The good news: your nervous system can learn to downregulate. With targeted breathwork and somatic exercises, you can train your vagus nerve to activate the calming parasympathetic response, helping you shift from reactive to responsive.",
    ],
    benefits: [
      { icon: Brain, text: "Calm your racing mind with extended exhale breathwork" },
      { icon: Target, text: "Release physical tension through somatic shaking and grounding" },
      { icon: TrendingUp, text: "Track your regulation progress over time" },
      { icon: Sparkles, text: "AI-personalized protocols that adapt to your state" },
    ],
  },
  freeze: {
    label: "Freeze",
    icon: Snowflake,
    gradient: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-500/30",
    description: [
      "Your nervous system has hit the brakes. When fight or flight doesn't feel possible, your body defaults to freeze -- a state of disconnection, dissociation, and numbness. You might feel like you're going through the motions of life without truly being present.",
      "Brain fog, difficulty making decisions, feeling emotionally flat, and a sense of being 'stuck' are hallmarks of the freeze response. It's not laziness or apathy -- it's a protective mechanism that was once necessary for survival.",
      "Recovery from freeze involves gentle activation. Rather than forcing yourself into high-energy states, NervSync uses graduated somatic exercises and orienting techniques to help your nervous system slowly come back online -- safely and at your own pace.",
    ],
    benefits: [
      { icon: Brain, text: "Gentle activation protocols to reconnect with your body" },
      { icon: Target, text: "Orienting exercises to rebuild presence and awareness" },
      { icon: TrendingUp, text: "Gradual progression from freeze to engagement" },
      { icon: Sparkles, text: "AI coaching that respects your pace of recovery" },
    ],
  },
  fawn: {
    label: "Fawn",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/30",
    description: [
      "Your nervous system is in people-pleasing mode. The fawn response means your safety strategy is built around monitoring and meeting others' needs, often at the expense of your own. You're hyperattuned to others' emotions and constantly adjusting yourself to keep the peace.",
      "This can show up as difficulty saying no, chronic exhaustion from emotional labor, losing touch with your own needs and desires, and feeling responsible for everyone else's feelings. It's a survival pattern that once kept you safe but now drains your energy.",
      "Healing the fawn response involves reconnecting with your own body signals, building internal safety, and gradually learning to tolerate the discomfort of setting boundaries. NervSync's interoception exercises help you rebuild the connection to your own needs.",
    ],
    benefits: [
      { icon: Brain, text: "Interoception exercises to reconnect with your own needs" },
      { icon: Target, text: "Boundary-building practices rooted in somatic safety" },
      { icon: TrendingUp, text: "Track your energy patterns and identify drains" },
      { icon: Sparkles, text: "AI coach that helps you prioritize self-regulation" },
    ],
  },
  dorsal_collapse: {
    label: "Dorsal Collapse",
    icon: BatteryLow,
    gradient: "from-gray-500 to-slate-600",
    borderColor: "border-gray-500/30",
    description: [
      "Your nervous system is in conservation mode. The dorsal vagal state represents the deepest level of shutdown -- a state of profound fatigue, withdrawal, and heaviness. Your body has decided that conserving energy is the safest strategy.",
      "This can manifest as persistent fatigue regardless of sleep, social withdrawal, loss of motivation, feeling heavy or weighed down, and a sense of hopelessness. It's not depression in the traditional sense -- it's a physiological state driven by your autonomic nervous system.",
      "Recovery from dorsal collapse is gentle and incremental. NervSync uses micro-activations, gentle movement, and co-regulation techniques to help your nervous system gradually build capacity for engagement without overwhelming it.",
    ],
    benefits: [
      { icon: Brain, text: "Micro-activation protocols to gently build energy" },
      { icon: Target, text: "Co-regulation exercises for safe social engagement" },
      { icon: TrendingUp, text: "Track your energy trajectory and celebrate small wins" },
      { icon: Sparkles, text: "Protocols designed for low-energy starting points" },
    ],
  },
  ventral_vagal: {
    label: "Ventral Vagal",
    icon: Sun,
    gradient: "from-emerald-400 to-teal-400",
    borderColor: "border-emerald-500/30",
    description: [
      "Your nervous system is well-regulated. The ventral vagal state is the gold standard -- you feel safe, connected, and present. You can handle stress without being overwhelmed, connect with others authentically, and recover from challenges relatively quickly.",
      "This doesn't mean you never feel stressed or anxious. It means your nervous system has a strong foundation of safety and can return to baseline after activation. You have good vagal tone and a wide window of tolerance.",
      "NervSync can help you maintain and deepen this resilience. Consistent daily practice strengthens your vagal tone, expands your window of tolerance, and builds the neural pathways that keep you regulated even when life gets challenging.",
    ],
    benefits: [
      { icon: Brain, text: "Advanced breathwork to deepen your vagal tone" },
      { icon: Target, text: "Expand your window of tolerance with progressive protocols" },
      { icon: TrendingUp, text: "Track and maintain your regulation score over time" },
      { icon: Sparkles, text: "Challenge protocols to build even greater resilience" },
    ],
  },
}

function ResultContent() {
  const searchParams = useSearchParams()
  const stateParam = searchParams.get("state") as NSState | null
  const state = stateParam && stateParam in stateProfiles ? stateParam : "fight_flight"
  const profile = stateProfiles[state]
  const Icon = profile.icon

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-[#F8FAFC]">
      {/* Header */}
      <div className="border-b border-[#1E293B] px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#3B82F6]" />
            <span className="font-bold">NervSync</span>
          </Link>
          <Link
            href="/quiz"
            className="text-sm text-[#94A3B8] hover:text-white transition-colors"
          >
            Retake Quiz
          </Link>
        </div>
      </div>

      <div className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-bold md:text-4xl">
            Your Nervous System Profile
          </h1>

          {/* State Card */}
          <div
            className={`mt-10 rounded-2xl border ${profile.borderColor} bg-gradient-to-br ${profile.gradient} p-[1px]`}
          >
            <div className="rounded-2xl bg-[#0F172A] p-8 text-center">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${profile.gradient} bg-opacity-20`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">{profile.label}</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">Your dominant nervous system state</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10 space-y-4">
            {profile.description.map((paragraph, i) => (
              <p key={i} className="text-[#94A3B8] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* How NervSync Helps */}
          <div className="mt-12">
            <h3 className="text-xl font-bold">How NervSync Helps</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {profile.benefits.map((benefit, i) => {
                const BenefitIcon = benefit.icon
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-[#334155] bg-[#1E293B] p-4"
                  >
                    <BenefitIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#14B8A6]" />
                    <p className="text-sm text-[#94A3B8]">{benefit.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/login"
              className="inline-block rounded-xl bg-[#3B82F6] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#3B82F6]/25 hover:bg-[#2563EB] transition-colors"
            >
              Start Your Free Trial
            </Link>
            <p className="mt-3 text-sm text-[#94A3B8]">
              7 days free. No credit card required to start.
            </p>
          </div>

          {/* Footer disclaimer */}
          <div className="mt-16 border-t border-[#1E293B] pt-8">
            <p className="text-center text-xs text-[#475569] leading-relaxed">
              NervSync is a wellness product and is not intended to diagnose, treat, cure, or
              prevent any disease. If you are in crisis, contact 988 (Suicide &amp; Crisis Lifeline)
              or your local emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
