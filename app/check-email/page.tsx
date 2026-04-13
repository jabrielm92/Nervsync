"use client"

import Link from "next/link"
import { Zap, Mail, ArrowLeft } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-[#3B82F6]" />
            <span className="text-2xl font-bold text-[#F8FAFC]">NervSync</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6]/20">
            <Mail className="h-8 w-8 text-[#3B82F6]" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#F8FAFC]">Check Your Email</h1>

          <p className="mt-3 text-[#94A3B8]">
            We sent you a magic link to sign in. Click the link in your email to continue.
          </p>

          <p className="mt-4 text-sm text-[#475569]">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
