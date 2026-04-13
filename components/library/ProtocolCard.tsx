"use client"

import { useRouter } from "next/navigation"
import {
  Clock,
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

interface ProtocolCardProps {
  id: string
  name: string
  category: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
}

const categoryIcons: Record<string, React.ReactNode> = {
  Breathwork: <Wind className="w-4 h-4" />,
  Somatic: <Hand className="w-4 h-4" />,
  "Vagal Toning": <Heart className="w-4 h-4" />,
  Grounding: <Target className="w-4 h-4" />,
  Movement: <Footprints className="w-4 h-4" />,
  Sound: <Music className="w-4 h-4" />,
  "Cold Exposure": <Snowflake className="w-4 h-4" />,
  "Self-Compassion": <Sparkles className="w-4 h-4" />,
  Advanced: <Zap className="w-4 h-4" />,
}

const difficultyColor = {
  beginner: "bg-[#14B8A6]/20 text-[#14B8A6]",
  intermediate: "bg-[#F59E0B]/20 text-[#F59E0B]",
  advanced: "bg-[#EF4444]/20 text-[#EF4444]",
}

export default function ProtocolCard({
  id,
  name,
  category,
  duration,
  difficulty,
}: ProtocolCardProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(`/library/${id}`)}
      className="w-full text-left rounded-xl border border-[#334155] bg-[#1E293B] p-4 hover:border-[#3B82F6]/40 hover:bg-[#1E293B]/80 transition-all group"
    >
      <div className="flex items-start gap-3">
        {/* Category icon */}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] shrink-0 group-hover:bg-[#3B82F6]/20 transition-colors">
          {categoryIcons[category] ?? <Wind className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1.5 truncate">
            {name}
          </h3>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
              <Clock className="w-3 h-3" />
              {duration} min
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${difficultyColor[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
