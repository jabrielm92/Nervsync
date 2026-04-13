"use client"

import { useState } from "react"
import { Check, Star, Crown, Zap } from "lucide-react"

const plans = [
  {
    id: "monthly" as const,
    name: "Monthly",
    price: "$14.99",
    period: "/mo",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Unlimited AI-personalized sessions",
      "50+ breathwork & somatic protocols",
      "AI Nervous System Coach",
      "Daily check-ins & regulation scoring",
      "Sleep protocols & wind-down routines",
      "SOS Mode for acute stress",
      "Somatic journal with AI reflections",
      "Weekly insights & trend analysis",
      "Structured multi-week programs",
    ],
    icon: Star,
  },
  {
    id: "annual" as const,
    name: "Annual",
    price: "$99",
    period: "/yr",
    badge: "Save 45%",
    highlighted: false,
    features: [
      "Everything in Monthly",
      "Priority access to new features",
      "Extended session history",
      "Advanced analytics & exports",
    ],
    icon: Zap,
  },
  {
    id: "lifetime" as const,
    name: "Lifetime",
    price: "$199",
    period: "",
    badge: "Best Value",
    highlighted: false,
    features: [
      "Everything in Annual",
      "One-time payment, forever access",
      "Founding member status",
      "All future features included",
    ],
    icon: Crown,
  },
]

interface PricingCardsProps {
  size?: "compact" | "full"
}

export default function PricingCards({ size = "compact" }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(plan: "monthly" | "annual" | "lifetime") {
    setLoading(plan)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (res.status === 401) {
        window.location.href = "/login"
      }
    } catch {
      // Silently handle - user can retry
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {plans.map((plan) => {
        const Icon = plan.icon
        return (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
              plan.highlighted
                ? "border-[#3B82F6] bg-[#1E293B] shadow-lg shadow-[#3B82F6]/10 scale-[1.02]"
                : "border-[#334155] bg-[#1E293B]/60 hover:border-[#3B82F6]/50"
            }`}
          >
            {plan.badge && (
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${
                  plan.highlighted
                    ? "bg-[#3B82F6] text-white"
                    : "bg-[#334155] text-[#94A3B8]"
                }`}
              >
                {plan.badge}
              </div>
            )}

            <div className="flex items-center gap-3 mb-4 mt-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                  plan.highlighted
                    ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                    : "bg-[#334155] text-[#94A3B8]"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">
                {plan.name}
              </h3>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-[#F8FAFC]">
                {plan.price}
              </span>
              <span className="text-[#94A3B8] ml-1">{plan.period}</span>
            </div>

            {size === "full" && (
              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#14B8A6] mt-0.5 shrink-0" />
                    <span className="text-sm text-[#94A3B8]">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading !== null}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                plan.highlighted
                  ? "bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/25"
                  : "bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                "Start 7-Day Free Trial"
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
