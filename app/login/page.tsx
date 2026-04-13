"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Zap, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [googleLoading, setGoogleLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch {
      setGoogleLoading(false)
    }
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmailLoading(true)
    try {
      await signIn("resend", { email, callbackUrl: "/dashboard" })
    } catch {
      setEmailLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
      {/* Pulsing teal circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="h-[400px] w-[400px] animate-pulse rounded-full bg-[#14B8A6] opacity-[0.05]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-[#3B82F6]" />
            <span className="text-2xl font-bold text-[#F8FAFC]">NervSync</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-8">
          <h1 className="text-center text-2xl font-bold text-[#F8FAFC]">
            Welcome to NervSync
          </h1>
          <p className="mt-2 text-center text-sm text-[#94A3B8]">
            Sign in to start regulating your nervous system
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-[#334155] bg-transparent px-4 py-3 text-sm font-semibold text-[#F8FAFC] transition-colors hover:bg-[#334155]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Connecting...
              </span>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#334155]" />
            <span className="text-xs text-[#94A3B8]">or continue with email</span>
            <div className="h-px flex-1 bg-[#334155]" />
          </div>

          {/* Email Sign In */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={emailLoading || !email.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/25 hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending...
                </span>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#475569]">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-[#94A3B8] hover:text-white transition-colors">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#94A3B8] hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
