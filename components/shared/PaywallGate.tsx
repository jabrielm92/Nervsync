"use client"

import { useEffect, useState, ReactNode } from "react"
import { Lock, Zap } from "lucide-react"
import Link from "next/link"

interface SubscriptionInfo {
  subscriptionStatus: string
  trialEndsAt: string | null
}

interface PaywallGateProps {
  children: ReactNode
}

export default function PaywallGate({ children }: PaywallGateProps) {
  const [status, setStatus] = useState<"loading" | "active" | "blocked">("loading")

  useEffect(() => {
    async function checkSubscription() {
      try {
        const res = await fetch("/api/stripe/portal", { method: "OPTIONS" }).catch(() => null)
        // Use a dedicated lightweight endpoint if available, otherwise check user data
        const userRes = await fetch("/api/checkin", { method: "OPTIONS" }).catch(() => null)

        // Fallback: fetch user subscription info from a known endpoint
        const checkRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "check" }), // Will fail validation, but 401 = not logged in
        })

        if (checkRes.status === 401) {
          setStatus("blocked")
          return
        }

        // Try to get user profile info
        const profileRes = await fetch("/api/session/generate", {
          method: "OPTIONS",
        }).catch(() => null)

        // For now, just render children - the actual subscription check
        // should be done via a dedicated API endpoint
        setStatus("active")
      } catch {
        setStatus("active") // Fail open for now
      }
    }

    // Simple approach: check via dedicated endpoint
    checkAccess()

    async function checkAccess() {
      try {
        const res = await fetch("/api/user/subscription")
        if (!res.ok) {
          setStatus("active") // Fail open if endpoint doesn't exist yet
          return
        }
        const data: SubscriptionInfo = await res.json()

        const now = new Date()
        const trialEnd = data.trialEndsAt ? new Date(data.trialEndsAt) : null

        const isActive = data.subscriptionStatus === "active" || data.subscriptionStatus === "lifetime"
        const isTrialing = data.subscriptionStatus === "trialing" && trialEnd && trialEnd > now

        if (isActive || isTrialing) {
          setStatus("active")
        } else {
          setStatus("blocked")
        }
      } catch {
        setStatus("active") // Fail open if endpoint doesn't exist
      }
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === "blocked") {
    return (
      <div className="relative min-h-screen">
        {/* Blurred content behind */}
        <div className="blur-sm pointer-events-none opacity-40">
          {children}
        </div>

        {/* Paywall overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1E293B] rounded-2xl border border-[#334155] p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-[#3B82F6]/10">
              <Lock className="w-8 h-8 text-[#3B82F6]" />
            </div>

            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">
              Your free trial has ended
            </h2>
            <p className="text-[#94A3B8] mb-8 leading-relaxed">
              Upgrade to continue training your nervous system with AI-personalized protocols, coaching, and insights.
            </p>

            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/25"
            >
              <Zap className="w-4 h-4" />
              Upgrade Now
            </Link>

            <p className="mt-4 text-xs text-[#64748B]">
              Plans start at $8.25/mo billed annually
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
