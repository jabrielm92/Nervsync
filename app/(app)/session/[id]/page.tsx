"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import LoadingBreath from "@/components/shared/LoadingBreath"
import SessionPlayer from "@/components/session/SessionPlayer"

interface Exercise {
  name: string
  description?: string
  instructions?: string
  durationSeconds: number
  breathCues?: {
    inhale: number
    hold: number
    exhale: number
    holdEmpty: number
  }
  cycles?: number
}

interface SessionData {
  id: string
  title: string
  description?: string
  exercises: Exercise[]
  completedAt?: string | null
}

export default function SessionReplayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session/${id}`)
        if (!res.ok) {
          throw new Error("Session not found")
        }
        const data = await res.json()
        const exercises = Array.isArray(data.exercises) ? data.exercises : []
        setSession({ ...data, exercises })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load session")
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [id])

  const handleClose = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <LoadingBreath message="Loading session..." />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#F8FAFC] text-lg font-semibold mb-2">
            Session not found
          </p>
          <p className="text-[#94A3B8] text-sm mb-6">
            {error ?? "This session may have been deleted."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl bg-[#3B82F6] text-white font-semibold text-sm transition-all active:scale-[0.97]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (session.exercises.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#F8FAFC] text-lg font-semibold mb-2">
            No exercises found
          </p>
          <p className="text-[#94A3B8] text-sm mb-6">
            This session doesn&apos;t have any exercises to replay.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl bg-[#3B82F6] text-white font-semibold text-sm transition-all active:scale-[0.97]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <SessionPlayer session={session} onClose={handleClose} />
}
