"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send } from "lucide-react"
import ChatMessage from "./ChatMessage"
import SuggestedQuestions from "./SuggestedQuestions"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [messageCount, setMessageCount] = useState(30)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming || messageCount <= 0) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsStreaming(true)
      setMessageCount((c) => c - 1)

      const assistantId = crypto.randomUUID()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
      ])

      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        })

        if (!res.ok) throw new Error("Failed to send message")

        const reader = res.body?.getReader()
        if (!reader) throw new Error("No response stream")

        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          accumulated += decoder.decode(value, { stream: true })
          const current = accumulated
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: current } : m
            )
          )
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm sorry, I couldn't process that right now. Please try again.",
                }
              : m
          )
        )
      } finally {
        setIsStreaming(false)
      }
    },
    [isStreaming, messageCount]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header info */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#334155]">
        <span className="text-sm text-[#94A3B8]">AI Coach</span>
        <span className="text-xs text-[#64748B]">
          {messageCount}/30 messages today
        </span>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <SuggestedQuestions onSelect={sendMessage} />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                createdAt={msg.createdAt}
              />
            ))}
            {isStreaming &&
              messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start mb-3">
                  <div className="bg-[#1E293B] rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#64748B] animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-[#64748B] animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-[#64748B] animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
          </>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-[#334155] bg-[#0F172A]"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            messageCount <= 0
              ? "Daily limit reached"
              : "Ask your coach..."
          }
          disabled={isStreaming || messageCount <= 0}
          className="flex-1 h-10 rounded-xl bg-[#1E293B] border border-[#334155] px-4 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming || messageCount <= 0}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#3B82F6] text-white disabled:opacity-40 hover:bg-[#2563EB] transition-colors shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
