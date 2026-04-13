"use client"

import { Bell } from "lucide-react"

interface AppHeaderProps {
  title?: string
}

export default function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 bg-[#0F172A]/80 backdrop-blur-lg border-b border-[#334155]">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-[#F8FAFC] truncate">
        {title ?? "NervSync"}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          type="button"
          className="relative flex items-center justify-center w-9 h-9 rounded-full text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3B82F6]" />
        </button>

        {/* User avatar */}
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] text-white text-sm font-semibold"
          aria-label="Account"
        >
          U
        </button>
      </div>
    </header>
  )
}
