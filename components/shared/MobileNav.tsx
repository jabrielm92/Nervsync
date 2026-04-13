"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ClipboardCheck, AlertCircle, BookOpen, MessageCircle } from "lucide-react"

const tabs = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Check-In", href: "/checkin", icon: ClipboardCheck },
  { label: "SOS", href: "/sos", icon: AlertCircle, sos: true },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Coach", href: "/coach", icon: MessageCircle },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0F172A]/95 backdrop-blur-lg border-t border-[#334155] safe-bottom">
      <div className="flex items-end justify-around px-2 pt-2 pb-2">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          const Icon = tab.icon

          if (tab.sos) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center gap-0.5 -mt-3"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-red-500 shadow-lg shadow-amber-500/25">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-amber-400">
                  {tab.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 py-1 min-w-[56px]"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-[#3B82F6]" : "text-[#64748B]"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#3B82F6]" : "text-[#64748B]"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
