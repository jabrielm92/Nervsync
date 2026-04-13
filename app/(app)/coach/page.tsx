"use client"

import ChatInterface from "@/components/coach/ChatInterface"

export default function CoachPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] md:h-screen bg-[#0F172A]">
      <ChatInterface />
    </div>
  )
}
