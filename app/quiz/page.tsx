"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, ChevronLeft } from "lucide-react"
import Link from "next/link"

type NSState = "fight_flight" | "freeze" | "fawn" | "dorsal_collapse" | "ventral_vagal"

interface Option {
  label: string
  state: NSState
}

interface Question {
  question: string
  options: Option[]
}

const questions: Question[] = [
  {
    question: "When you're stressed, what happens first?",
    options: [
      { label: "Heart races, mind spins", state: "fight_flight" },
      { label: "I zone out, go blank", state: "freeze" },
      { label: "I focus on making others okay", state: "fawn" },
      { label: "I feel heavy, want to hide", state: "dorsal_collapse" },
      { label: "I generally manage okay", state: "ventral_vagal" },
    ],
  },
  {
    question: "How do you usually fall asleep?",
    options: [
      { label: "Mind racing, can't settle", state: "fight_flight" },
      { label: "Pass out from exhaustion", state: "dorsal_collapse" },
      { label: "Monitoring sounds, on alert", state: "fawn" },
      { label: "Feel nothing, just numb", state: "freeze" },
      { label: "Drift off naturally", state: "ventral_vagal" },
    ],
  },
  {
    question: "In conflict, you tend to...",
    options: [
      { label: "Get defensive or angry", state: "fight_flight" },
      { label: "Shut down, go silent", state: "freeze" },
      { label: "Apologize and accommodate", state: "fawn" },
      { label: "Feel too tired to engage", state: "dorsal_collapse" },
      { label: "Stay present and respond calmly", state: "ventral_vagal" },
    ],
  },
  {
    question: "Your energy pattern is typically...",
    options: [
      { label: "Wired then crashed", state: "fight_flight" },
      { label: "Constantly foggy", state: "freeze" },
      { label: "Depends on who I'm around", state: "fawn" },
      { label: "Perpetually low", state: "dorsal_collapse" },
      { label: "Steady throughout the day", state: "ventral_vagal" },
    ],
  },
  {
    question: "Which describes you best right now?",
    options: [
      { label: "I can't stop or relax", state: "fight_flight" },
      { label: "I feel disconnected from everything", state: "freeze" },
      { label: "I'm exhausted from people-pleasing", state: "fawn" },
      { label: "I'm running on empty", state: "dorsal_collapse" },
      { label: "I feel balanced and grounded", state: "ventral_vagal" },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<NSState[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  const progress = ((currentQuestion) / questions.length) * 100

  function handleSelect(state: NSState) {
    if (isTransitioning) return
    setIsTransitioning(true)

    const newAnswers = [...answers, state]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
        setIsTransitioning(false)
      }, 300)
    } else {
      // Tally results
      const counts: Record<NSState, number> = {
        fight_flight: 0,
        freeze: 0,
        fawn: 0,
        dorsal_collapse: 0,
        ventral_vagal: 0,
      }
      newAnswers.forEach((a) => {
        counts[a]++
      })
      const dominant = (Object.entries(counts) as [NSState, number][]).sort(
        (a, b) => b[1] - a[1]
      )[0][0]

      router.push(`/result?state=${dominant}`)
    }
  }

  function handleBack() {
    if (currentQuestion > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setAnswers((prev) => prev.slice(0, -1))
      setTimeout(() => {
        setCurrentQuestion((prev) => prev - 1)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const q = questions[currentQuestion]

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-[#F8FAFC]">
      {/* Header */}
      <div className="border-b border-[#1E293B] px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#3B82F6]" />
            <span className="font-bold">NervSync</span>
          </Link>
          <span className="text-sm text-[#94A3B8]">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1E293B]">
        <div
          className="h-1 bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-1 text-sm text-[#94A3B8] hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <div
            className={`transition-all duration-300 ${
              isTransitioning ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            <h2 className="text-2xl font-bold md:text-3xl">{q.question}</h2>

            <div className="mt-8 flex flex-col gap-3">
              {q.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.state)}
                  className="w-full rounded-xl border border-[#334155] bg-[#1E293B] px-5 py-4 text-left text-[#F8FAFC] transition-all hover:border-[#3B82F6] hover:bg-[#1E293B]/80 active:scale-[0.98]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
