"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Play,
  Clock,
  AlertTriangle,
  Beaker,
  Loader2,
  Wind,
  Hand,
  Heart,
  Footprints,
  Music,
  Snowflake,
  Sparkles,
  Zap,
  Target,
} from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"

interface ProtocolDetail {
  id: string
  name: string
  description: string
  category: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  instructions: string[]
  scienceNote: string | null
  contraindications: string[]
  targetStates: string[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  Breathwork: <Wind className="w-5 h-5" />,
  Somatic: <Hand className="w-5 h-5" />,
  "Vagal Toning": <Heart className="w-5 h-5" />,
  Grounding: <Target className="w-5 h-5" />,
  Movement: <Footprints className="w-5 h-5" />,
  Sound: <Music className="w-5 h-5" />,
  "Cold Exposure": <Snowflake className="w-5 h-5" />,
  "Self-Compassion": <Sparkles className="w-5 h-5" />,
  Advanced: <Zap className="w-5 h-5" />,
}

export default function ProtocolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [protocol, setProtocol] = useState<ProtocolDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProtocol() {
      try {
        const res = await fetch(`/api/protocols/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProtocol(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchProtocol()
  }, [id])

  const difficultyColor = {
    beginner: "bg-[#14B8A6]/20 text-[#14B8A6]",
    intermediate: "bg-[#F59E0B]/20 text-[#F59E0B]",
    advanced: "bg-[#EF4444]/20 text-[#EF4444]",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <AppHeader title="Protocol" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
        </div>
      </div>
    )
  }

  if (!protocol) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <AppHeader title="Protocol" />
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-sm text-[#64748B]">Protocol not found.</p>
          <button
            onClick={() => router.push("/library")}
            className="mt-4 text-sm text-[#3B82F6] hover:underline"
          >
            Back to library
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AppHeader title={protocol.name} />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Back link */}
        <button
          onClick={() => router.push("/library")}
          className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        {/* Header */}
        <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] shrink-0">
              {categoryIcons[protocol.category] ?? (
                <Wind className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                {protocol.name}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {protocol.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                difficultyColor[protocol.difficulty]
              }`}
            >
              {protocol.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#64748B]">
              <Clock className="w-3 h-3" />
              {protocol.duration} min
            </span>
          </div>

          <p className="text-sm text-[#CBD5E1] leading-relaxed">
            {protocol.description}
          </p>

          {/* Target states */}
          {protocol.targetStates.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {protocol.targetStates.map((state) => (
                <span
                  key={state}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#334155] text-[#94A3B8]"
                >
                  {state}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        {protocol.instructions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wide">
              Instructions
            </h3>
            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 space-y-3">
              {protocol.instructions.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-semibold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Science note */}
        {protocol.scienceNote && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wide">
              Science
            </h3>
            <div className="rounded-xl border-l-4 border-[#3B82F6] bg-[#1E293B] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Beaker className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-semibold text-[#3B82F6]">
                  How it works
                </span>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {protocol.scienceNote}
              </p>
            </div>
          </div>
        )}

        {/* Contraindications */}
        {protocol.contraindications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wide">
              Contraindications
            </h3>
            <div className="rounded-xl border-l-4 border-[#F59E0B] bg-[#1E293B] p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs font-semibold text-[#F59E0B]">
                  Caution
                </span>
              </div>
              <ul className="space-y-1.5">
                {protocol.contraindications.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-[#94A3B8] leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-[#F59E0B] mt-1.5 shrink-0">
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={() => {
            router.push(`/session?protocol=${protocol.id}`)
          }}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors"
        >
          <Play className="w-4 h-4" />
          Start Protocol
        </button>
      </div>
    </div>
  )
}
