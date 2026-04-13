"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, BookOpen, Loader2 } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import ProtocolCard from "@/components/library/ProtocolCard"
import CategoryFilter from "@/components/library/CategoryFilter"

interface Protocol {
  id: string
  name: string
  category: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  targetStates: string[]
}

const CATEGORIES = [
  "All",
  "Breathwork",
  "Somatic",
  "Vagal Toning",
  "Grounding",
  "Movement",
  "Sound",
  "Cold Exposure",
  "Self-Compassion",
  "Advanced",
]

export default function LibraryPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    async function fetchProtocols() {
      try {
        const res = await fetch("/api/protocols")
        if (res.ok) {
          const data = await res.json()
          setProtocols(data.protocols ?? [])
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchProtocols()
  }, [])

  const filtered = useMemo(() => {
    let result = protocols

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.targetStates.some((s) => s.toLowerCase().includes(q))
      )
    }

    return result
  }, [protocols, activeCategory, search])

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AppHeader title="Protocol Library" />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search protocols..."
            className="w-full h-11 rounded-xl border border-[#334155] bg-[#1E293B] pl-10 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>

        {/* Category filter */}
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Protocol list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-10 h-10 text-[#334155] mb-3" />
            <p className="text-sm text-[#64748B]">
              {search || activeCategory !== "All"
                ? "No protocols match your search."
                : "No protocols available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((protocol) => (
              <ProtocolCard
                key={protocol.id}
                id={protocol.id}
                name={protocol.name}
                category={protocol.category}
                duration={protocol.duration}
                difficulty={protocol.difficulty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
