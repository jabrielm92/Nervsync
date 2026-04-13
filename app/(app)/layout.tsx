"use client"

import MobileNav from "@/components/shared/MobileNav"
import Sidebar from "@/components/shared/Sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}
