"use client"

import { useState, useEffect } from "react"
import { Plus, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Glimmer {
  id: string
  content: string
  category: string | null
  createdAt: string
}

const CATEGORIES = [
  "nature",
  "connection",
  "movement",
  "creativity",
  "calm",
  "joy",
  "gratitude",
  "other",
]

const categoryColors: Record<string, string> = {
  nature: "#10B981",
  connection: "#3B82F6",
  movement: "#F59E0B",
  creativity: "#A855F7",
  calm: "#14B8A6",
  joy: "#F97316",
  gratitude: "#EC4899",
  other: "#64748B",
}

export default function GlimmerFeed() {
  const [glimmers, setGlimmers] = useState<Glimmer[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newContent, setNewContent] = useState("")
  const [newCategory, setNewCategory] = useState("other")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchGlimmers() {
      try {
        const res = await fetch("/api/glimmers?limit=10")
        if (res.ok) {
          const data = await res.json()
          setGlimmers(data)
        }
      } catch {
        // Glimmers API may not exist yet, show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchGlimmers()
  }, [])

  async function handleAddGlimmer() {
    if (!newContent.trim()) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/glimmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent.trim(),
          category: newCategory,
        }),
      })

      if (res.ok) {
        const glimmer = await res.json()
        setGlimmers((prev) => [glimmer, ...prev])
        setNewContent("")
        setNewCategory("other")
        setDialogOpen(false)
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-[#334155] bg-[#1E293B]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 rounded bg-[#334155] animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-[#334155] animate-pulse" />
          </div>
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-36 flex-shrink-0 rounded-lg bg-[#334155] animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#334155] bg-[#1E293B]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Glimmers</h3>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] hover:bg-[#3B82F6]/30 transition-colors">
              <Plus className="w-4 h-4" />
            </DialogTrigger>
            <DialogContent className="bg-[#1E293B] border-[#334155] text-[#F8FAFC] max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle className="text-[#F8FAFC]">
                  Capture a Glimmer
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-[#94A3B8]">
                A glimmer is a small moment of safety, connection, or joy.
              </p>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="What sparked a moment of goodness?"
                className="w-full h-24 rounded-lg bg-[#0F172A] border border-[#334155] text-[#F8FAFC] placeholder-[#64748B] p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              />
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor:
                        newCategory === cat
                          ? categoryColors[cat] + "30"
                          : "#0F172A",
                      color:
                        newCategory === cat
                          ? categoryColors[cat]
                          : "#64748B",
                      border: `1px solid ${
                        newCategory === cat
                          ? categoryColors[cat] + "60"
                          : "#334155"
                      }`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <Button
                onClick={handleAddGlimmer}
                disabled={!newContent.trim() || submitting}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
              >
                {submitting ? "Saving..." : "Save Glimmer"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {glimmers.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-[#64748B]">
              No glimmers yet. Tap + to capture your first one.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {glimmers.map((glimmer) => (
              <div
                key={glimmer.id}
                className="flex-shrink-0 w-40 p-3 rounded-lg bg-[#0F172A] border border-[#334155]"
              >
                <p className="text-xs text-[#CBD5E1] line-clamp-3 mb-2">
                  {glimmer.content}
                </p>
                {glimmer.category && (
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor:
                        (categoryColors[glimmer.category] ?? "#64748B") + "20",
                      color: categoryColors[glimmer.category] ?? "#64748B",
                    }}
                  >
                    {glimmer.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
