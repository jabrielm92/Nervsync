"use client"

interface LoadingBreathProps {
  message?: string
}

export default function LoadingBreath({ message = "Loading..." }: LoadingBreathProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      {/* Pulsing breath circle */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#14B8A6]/20 to-[#3B82F6]/20"
          style={{
            animation: "breathe-loading 4s ease-in-out infinite",
          }}
        />
        {/* Main circle */}
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#3B82F6]"
          style={{
            animation: "breathe-loading 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Message */}
      <p className="text-sm text-[#94A3B8] font-medium animate-pulse">
        {message}
      </p>

      <style jsx>{`
        @keyframes breathe-loading {
          0%, 100% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
