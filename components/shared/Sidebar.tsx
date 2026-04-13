"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ClipboardCheck,
  AlertCircle,
  Sparkles,
  BookOpen,
  MessageCircle,
  PenLine,
  Moon,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Check-In", href: "/checkin", icon: ClipboardCheck },
  { label: "Programs", href: "/programs", icon: Sparkles },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Coach", href: "/coach", icon: MessageCircle },
  { label: "Journal", href: "/journal", icon: PenLine },
  { label: "Sleep", href: "/sleep", icon: Moon },
  { label: "Insights", href: "/insights", icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#0F172A] border-r border-[#334155] z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#334155]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#14B8A6]">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-[#F8FAFC] tracking-tight">
          NervSync
        </span>
      </div>

      {/* SOS Button */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href="/sos"
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold transition-all ${
            pathname.startsWith("/sos")
              ? "bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/25"
              : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          <span>SOS Center</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#1E293B] text-[#3B82F6]"
                  : "text-[#94A3B8] hover:bg-[#1E293B]/60 hover:text-[#F8FAFC]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-3 py-4 border-t border-[#334155]">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname.startsWith("/settings")
              ? "bg-[#1E293B] text-[#3B82F6]"
              : "text-[#94A3B8] hover:bg-[#1E293B]/60 hover:text-[#F8FAFC]"
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}
