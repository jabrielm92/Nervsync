"use client"

import { useState, useEffect } from "react"
import {
  Moon,
  Sun,
  TrendingUp,
  Save,
  Loader2,
  BedDouble,
  Clock,
  Smartphone,
} from "lucide-react"
import AppHeader from "@/components/shared/AppHeader"
import SleepChart from "@/components/sleep/SleepChart"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const WAKE_FEELINGS = ["refreshed", "groggy", "wired", "heavy"] as const
const DREAM_ACTIVITIES = ["none", "light", "vivid", "nightmare"] as const

interface SleepTrends {
  chart: { date: string; score: number }[]
  avgQuality: number
  avgDuration: number
  bestDay: string | null
  worstDay: string | null
}

export default function SleepPage() {
  // Evening state
  const [stressLevel, setStressLevel] = useState(3)
  const [screenFreeMinutes, setScreenFreeMinutes] = useState("")
  const [bedtime, setBedtime] = useState("")
  const [eveningNotes, setEveningNotes] = useState("")
  const [eveningSaving, setEveningSaving] = useState(false)

  // Morning state
  const [sleepQuality, setSleepQuality] = useState(3)
  const [hoursSlept, setHoursSlept] = useState("")
  const [wakeFeeling, setWakeFeeling] = useState<(typeof WAKE_FEELINGS)[number]>("groggy")
  const [dreamActivity, setDreamActivity] = useState<(typeof DREAM_ACTIVITIES)[number]>("none")
  const [morningNotes, setMorningNotes] = useState("")
  const [morningSaving, setMorningSaving] = useState(false)

  // Trends state
  const [trends, setTrends] = useState<SleepTrends | null>(null)
  const [trendsLoading, setTrendsLoading] = useState(true)

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch("/api/sleep/trends")
        if (res.ok) {
          const data = await res.json()
          setTrends(data)
        }
      } catch {
        // silently fail
      } finally {
        setTrendsLoading(false)
      }
    }
    fetchTrends()
  }, [])

  const saveEvening = async () => {
    if (eveningSaving) return
    setEveningSaving(true)
    try {
      await fetch("/api/sleep/evening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stressLevel,
          screenFreeMinutes: screenFreeMinutes ? parseInt(screenFreeMinutes) : null,
          bedtime: bedtime || null,
          notes: eveningNotes || null,
        }),
      })
    } catch {
      // silently fail
    } finally {
      setEveningSaving(false)
    }
  }

  const saveMorning = async () => {
    if (morningSaving) return
    setMorningSaving(true)
    try {
      await fetch("/api/sleep/morning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sleepQuality,
          hoursSlept: hoursSlept ? parseFloat(hoursSlept) : null,
          wakeFeeling,
          dreamActivity,
          notes: morningNotes || null,
        }),
      })
    } catch {
      // silently fail
    } finally {
      setMorningSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AppHeader title="Sleep" />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="evening">
          <TabsList className="w-full bg-[#1E293B] border border-[#334155]">
            <TabsTrigger value="evening" className="flex-1 gap-1.5">
              <Moon className="w-4 h-4" />
              Evening
            </TabsTrigger>
            <TabsTrigger value="morning" className="flex-1 gap-1.5">
              <Sun className="w-4 h-4" />
              Morning
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex-1 gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          {/* Evening Tab */}
          <TabsContent value="evening" className="space-y-5 mt-6">
            {/* Pre-sleep stress level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC]">
                Pre-Sleep Stress Level
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setStressLevel(level)}
                    className={`flex-1 h-11 rounded-xl text-sm font-medium transition-colors ${
                      stressLevel === level
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#3B82F6]/40"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] px-1">
                <span>Calm</span>
                <span>Very stressed</span>
              </div>
            </div>

            {/* Screen-free minutes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#F8FAFC]">
                <Smartphone className="w-4 h-4 text-[#94A3B8]" />
                Screen-Free Minutes
              </label>
              <input
                type="number"
                value={screenFreeMinutes}
                onChange={(e) => setScreenFreeMinutes(e.target.value)}
                placeholder="e.g. 30"
                min={0}
                className="w-full h-11 rounded-xl border border-[#334155] bg-[#1E293B] px-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {/* Bedtime */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#F8FAFC]">
                <Clock className="w-4 h-4 text-[#94A3B8]" />
                Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#334155] bg-[#1E293B] px-4 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC]">
                Notes
              </label>
              <textarea
                value={eveningNotes}
                onChange={(e) => setEveningNotes(e.target.value)}
                placeholder="Anything on your mind before sleep..."
                rows={3}
                className="w-full rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none transition-colors"
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={saveEvening}
                disabled={eveningSaving}
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#3B82F6] text-white text-sm font-medium hover:bg-[#2563EB] disabled:opacity-40 transition-colors"
              >
                {eveningSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Evening Log
              </button>
              <button
                onClick={() => {
                  // Navigate to session with sleep protocol
                  window.location.href = "/session?protocol=sleep-evening"
                }}
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-[#14B8A6] text-[#14B8A6] text-sm font-medium hover:bg-[#14B8A6]/10 transition-colors"
              >
                <BedDouble className="w-4 h-4" />
                Start Evening Protocol
              </button>
            </div>
          </TabsContent>

          {/* Morning Tab */}
          <TabsContent value="morning" className="space-y-5 mt-6">
            {/* Sleep quality */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC]">
                Sleep Quality
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSleepQuality(level)}
                    className={`flex-1 h-11 rounded-xl text-sm font-medium transition-colors ${
                      sleepQuality === level
                        ? "bg-[#14B8A6] text-white"
                        : "bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#14B8A6]/40"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] px-1">
                <span>Terrible</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Hours slept */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#F8FAFC]">
                <Clock className="w-4 h-4 text-[#94A3B8]" />
                Hours Slept
              </label>
              <input
                type="number"
                value={hoursSlept}
                onChange={(e) => setHoursSlept(e.target.value)}
                placeholder="e.g. 7.5"
                step={0.5}
                min={0}
                max={24}
                className="w-full h-11 rounded-xl border border-[#334155] bg-[#1E293B] px-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {/* Wake feeling */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC]">
                How Do You Feel?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WAKE_FEELINGS.map((feeling) => (
                  <button
                    key={feeling}
                    type="button"
                    onClick={() => setWakeFeeling(feeling)}
                    className={`h-11 rounded-xl text-sm font-medium capitalize transition-colors ${
                      wakeFeeling === feeling
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#3B82F6]/40"
                    }`}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
            </div>

            {/* Dream activity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC]">
                Dream Activity
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DREAM_ACTIVITIES.map((dream) => (
                  <button
                    key={dream}
                    type="button"
                    onClick={() => setDreamActivity(dream)}
                    className={`h-11 rounded-xl text-sm font-medium capitalize transition-colors ${
                      dreamActivity === dream
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#3B82F6]/40"
                    }`}
                  >
                    {dream}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F8FAFC]">
                Notes
              </label>
              <textarea
                value={morningNotes}
                onChange={(e) => setMorningNotes(e.target.value)}
                placeholder="How did the night go? Any thoughts on waking..."
                rows={3}
                className="w-full rounded-xl border border-[#334155] bg-[#1E293B] px-4 py-3 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] resize-none transition-colors"
              />
            </div>

            {/* Save */}
            <button
              onClick={saveMorning}
              disabled={morningSaving}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#14B8A6] text-white text-sm font-medium hover:bg-[#0D9488] disabled:opacity-40 transition-colors"
            >
              {morningSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Morning Log
            </button>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-5 mt-6">
            {trendsLoading ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 animate-pulse">
                  <div className="h-4 w-40 rounded bg-[#334155] mb-4" />
                  <div className="h-40 rounded bg-[#334155]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 animate-pulse"
                    >
                      <div className="h-3 w-20 rounded bg-[#334155] mb-2" />
                      <div className="h-6 w-12 rounded bg-[#334155]" />
                    </div>
                  ))}
                </div>
              </div>
            ) : !trends || trends.chart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Moon className="w-10 h-10 text-[#334155] mb-3" />
                <p className="text-sm text-[#64748B]">
                  No sleep data yet. Start logging to see trends.
                </p>
              </div>
            ) : (
              <>
                <SleepChart data={trends.chart} />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4">
                    <p className="text-xs text-[#64748B] mb-1">Avg Quality</p>
                    <p className="text-2xl font-bold text-[#F8FAFC]">
                      {trends.avgQuality.toFixed(1)}
                      <span className="text-sm text-[#64748B] font-normal">
                        /5
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4">
                    <p className="text-xs text-[#64748B] mb-1">Avg Duration</p>
                    <p className="text-2xl font-bold text-[#F8FAFC]">
                      {trends.avgDuration.toFixed(1)}
                      <span className="text-sm text-[#64748B] font-normal">
                        hrs
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4">
                    <p className="text-xs text-[#64748B] mb-1">Best Day</p>
                    <p className="text-sm font-semibold text-[#14B8A6]">
                      {trends.bestDay
                        ? new Date(trends.bestDay).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "--"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4">
                    <p className="text-xs text-[#64748B] mb-1">Worst Day</p>
                    <p className="text-sm font-semibold text-[#EF4444]">
                      {trends.worstDay
                        ? new Date(trends.worstDay).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "--"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
