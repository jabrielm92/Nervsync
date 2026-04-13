"use client"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

export default function ChatMessage({ role, content, createdAt }: ChatMessageProps) {
  const isUser = role === "user"

  const time = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#3B82F6] text-white rounded-br-md"
            : "bg-[#1E293B] text-[#F8FAFC] rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? "text-white/60" : "text-[#64748B]"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
