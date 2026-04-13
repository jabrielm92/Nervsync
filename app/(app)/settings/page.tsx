"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  User,
  CreditCard,
  Settings,
  Clock,
  Sunrise,
  Sunset,
  ExternalLink,
  Download,
  Trash2,
  Shield,
  Save,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface UserData {
  name: string
  email: string
  timezone: string
  preferredDuration: number
  wakeTime: string
  bedTime: string
  primaryGoal: string
  subscriptionPlan: string
  subscriptionStatus: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    timezone: "America/New_York",
    preferredDuration: 10,
    wakeTime: "07:00",
    bedTime: "22:00",
    primaryGoal: "",
    subscriptionPlan: "trial",
    subscriptionStatus: "trialing",
  })

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/onboarding")
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            setUserData({
              name: data.user.name || "",
              email: data.user.email || "",
              timezone: data.user.timezone || "America/New_York",
              preferredDuration: data.user.preferredDuration || 10,
              wakeTime: data.user.wakeTime || "07:00",
              bedTime: data.user.bedTime || "22:00",
              primaryGoal: data.user.primaryGoal || "",
              subscriptionPlan: data.user.subscriptionPlan || "trial",
              subscriptionStatus: data.user.subscriptionStatus || "trialing",
            })
          }
        }
      } catch {
        // Use session data as fallback
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Fallback to session data
  useEffect(() => {
    if (session?.user && !userData.email) {
      setUserData((prev) => ({
        ...prev,
        name: session?.user?.name || prev.name,
        email: session?.user?.email || prev.email,
      }))
    }
  }, [session, userData.email])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          timezone: userData.timezone,
          preferredDuration: userData.preferredDuration,
          wakeTime: userData.wakeTime,
          bedTime: userData.bedTime,
          primaryGoal: userData.primaryGoal,
        }),
      })
    } catch {
      // Silently handle
    } finally {
      setSaving(false)
    }
  }

  async function handleManageBilling() {
    setBillingLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // Silently handle
    } finally {
      setBillingLoading(false)
    }
  }

  function getPlanBadge() {
    const plan = userData.subscriptionPlan
    const status = userData.subscriptionStatus
    if (status === "active") {
      return { label: plan === "annual" ? "Pro Annual" : plan === "lifetime" ? "Pro Lifetime" : "Pro Monthly", color: "bg-[#14B8A6]" }
    }
    if (status === "trialing") {
      return { label: "Free Trial", color: "bg-[#3B82F6]" }
    }
    return { label: "Inactive", color: "bg-[#475569]" }
  }

  const badge = getPlanBadge()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Profile */}
        <div className="mt-8 rounded-xl border border-[#334155] bg-[#1E293B] p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-[#3B82F6]" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1">Email</label>
              <input
                type="email"
                value={userData.email}
                readOnly
                className="w-full rounded-lg border border-[#334155] bg-[#0F172A]/50 px-4 py-2.5 text-sm text-[#475569] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1">Timezone</label>
              <input
                type="text"
                value={userData.timezone}
                onChange={(e) => setUserData({ ...userData, timezone: e.target.value })}
                placeholder="e.g., America/New_York"
                className="w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1">
                Preferred session duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((min) => (
                  <button
                    key={min}
                    onClick={() => setUserData({ ...userData, preferredDuration: min })}
                    className={`rounded-lg border py-2 text-sm font-medium transition-all ${
                      userData.preferredDuration === min
                        ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]"
                        : "border-[#334155] text-[#94A3B8] hover:border-[#3B82F6]/50"
                    }`}
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="mt-6 rounded-xl border border-[#334155] bg-[#1E293B] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-5 w-5 text-[#3B82F6]" />
            <h2 className="text-lg font-semibold">Subscription</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`${badge.color} rounded-full px-3 py-1 text-xs font-semibold text-white`}>
                {badge.label}
              </span>
              <span className="text-sm text-[#94A3B8] capitalize">
                {userData.subscriptionStatus}
              </span>
            </div>
            <button
              onClick={handleManageBilling}
              disabled={billingLoading}
              className="flex items-center gap-2 rounded-lg border border-[#334155] px-4 py-2 text-sm text-[#94A3B8] hover:text-white hover:border-[#3B82F6]/50 transition-colors disabled:opacity-50"
            >
              {billingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Manage Billing
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-6 rounded-xl border border-[#334155] bg-[#1E293B] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-[#3B82F6]" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sunrise className="h-4 w-4 text-[#F59E0B]" />
                  <label className="text-sm text-[#94A3B8]">Wake time</label>
                </div>
                <input
                  type="time"
                  value={userData.wakeTime}
                  onChange={(e) => setUserData({ ...userData, wakeTime: e.target.value })}
                  className="w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] [color-scheme:dark]"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sunset className="h-4 w-4 text-[#8B5CF6]" />
                  <label className="text-sm text-[#94A3B8]">Bed time</label>
                </div>
                <input
                  type="time"
                  value={userData.bedTime}
                  onChange={(e) => setUserData({ ...userData, bedTime: e.target.value })}
                  className="w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#3B82F6] [color-scheme:dark]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1">Primary goal</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { id: "stress", label: "Reduce stress" },
                  { id: "sleep", label: "Better sleep" },
                  { id: "energy", label: "More energy" },
                  { id: "focus", label: "Sharper focus" },
                  { id: "emotional_resilience", label: "Emotional resilience" },
                ].map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setUserData({ ...userData, primaryGoal: goal.id })}
                    className={`rounded-lg border px-4 py-2 text-sm text-left transition-all ${
                      userData.primaryGoal === goal.id
                        ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]"
                        : "border-[#334155] text-[#94A3B8] hover:border-[#3B82F6]/50"
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/25 hover:bg-[#2563EB] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Account */}
        <div className="mt-6 rounded-xl border border-[#334155] bg-[#1E293B] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-[#3B82F6]" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-[#334155] px-4 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:border-[#3B82F6]/50 transition-colors">
              <Download className="h-4 w-4" />
              Export My Data
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-6 rounded-xl border border-[#334155] bg-[#1E293B] p-6">
          <h2 className="text-lg font-semibold mb-4">Legal</h2>
          <div className="flex flex-wrap gap-4 text-sm text-[#94A3B8]">
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#475569] leading-relaxed">
            NervSync is a wellness product and is not intended to diagnose, treat, cure, or
            prevent any disease. If you are in crisis, contact 988 (Suicide &amp; Crisis Lifeline)
            or your local emergency services.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-[#334155] bg-[#1E293B] text-[#F8FAFC]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              This action is permanent and cannot be undone. All your data, including sessions,
              journal entries, and progress, will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm text-[#94A3B8] mb-2">
              Type <span className="font-mono text-red-400">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-lg border border-[#334155] bg-[#0F172A] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setDeleteOpen(false)
                setDeleteConfirm("")
              }}
              className="rounded-lg border border-[#334155] px-4 py-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={deleteConfirm !== "DELETE"}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete My Account
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
