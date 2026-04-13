"use client"

import { useState, useEffect } from "react"
import { BookOpen, Save, Loader2 } from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import JournalPrompt from "@/components/journal/JournalPrompt"
import JournalEntry from "@/components/journal/JournalEntry"

interface JournalEntryData {
  id: string
  date: string
  content: string
  emotionalTone: string | null
  tags: string[]
  aiReflection: string | null
}

export default function JournalPage() {
  const [prompt, setPrompt] = useState("")
  const [promptLoading, setPromptLoading] = useState(true)
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [entries, setEntries] = useState<JournalEntryData[]>([])
  const [entriesLoading, setEntriesLoading] = useState(true)

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const res = await fetch("/api/journal/prompt")
        if (res.ok) {
          const data = await res.json()
          setPrompt(data.prompt)
        }
      } catch {
        setPrompt("What is your nervous system telling you right now?")
      } finally {
        setPromptLoading(false)
      }
    }

    async function fetchEntries() {
      try {
        const res = await fetch("/api/journal")
        if (res.ok) {
          const data = await res.json()
          setEntries(data.entries ?? [])
        }
      } catch {
        // silently fail
      } finally {
        setEntriesLoading(false)
      }
    }

    fetchPrompt()
    fetchEntries()
  }, [])

  const handleSave = async () => {
    if (!content.trim() || saving) return
    setSaving(true)

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setEntries((prev) => [data.entry, ...prev])
        setContent("")
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AppHeader title="Journal" />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* AI Prompt */}
        <JournalPrompt prompt={prompt} loading={promptLoading} />

        {/* Write area */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[#94A3B8]" />
            <span className="text-sm font-medium text-[#F8FAFC]">
              Write
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How are you feeling? What's coming up for you?"
            rows={6}
            className="w-full rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none transition-colors"
          />
          <button
            onClick={handleSave}
            disabled={!content.trim() || saving}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] disabled:opacity-40 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Entry
          </button>
        </div>

        {/* Past entries */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wide">
            Past Entries
          </h2>

          {entriesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 animate-pulse"
                >
                  <div className="h-3 w-24 rounded bg-[#334155] mb-3" />
                  <div className="h-3 w-full rounded bg-[#334155] mb-2" />
                  <div className="h-3 w-3/4 rounded bg-[#334155]" />
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="w-10 h-10 text-[#334155] mb-3" />
              <p className="text-sm text-[#64748B]">
                No journal entries yet. Write your first one above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <JournalEntry
                  key={entry.id}
                  id={entry.id}
                  date={entry.date}
                  content={entry.content}
                  emotionalTone={entry.emotionalTone}
                  tags={entry.tags}
                  aiReflection={entry.aiReflection}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
