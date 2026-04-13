"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap,
  MessageCircle,
  Sparkles,
  Moon,
  AlertCircle,
  PenLine,
  BarChart3,
  BookOpen,
  Trophy,
  Check,
  X,
  ClipboardCheck,
  Wand2,
  HeartPulse,
  ChevronRight,
} from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import PricingCards from "@/components/marketing/PricingCards"

const features = [
  {
    icon: MessageCircle,
    title: "AI Coach",
    description: "Chat with a nervous-system-literate AI that knows your patterns.",
  },
  {
    icon: Sparkles,
    title: "Structured Programs",
    description: "Multi-week guided programs for lasting nervous system change.",
  },
  {
    icon: Moon,
    title: "Sleep Protocols",
    description: "Wind-down routines and sleep tracking built for your biology.",
  },
  {
    icon: AlertCircle,
    title: "SOS Emergency",
    description: "Instant regulation exercises when you need them most.",
  },
  {
    icon: PenLine,
    title: "NS Journal",
    description: "Somatic journaling with AI-powered reflections and insights.",
  },
  {
    icon: BarChart3,
    title: "Deep Insights",
    description: "Track your regulation score, triggers, and nervous system trends.",
  },
  {
    icon: BookOpen,
    title: "50+ Protocols",
    description: "Breathwork, somatic exercises, vagal toning, and more.",
  },
  {
    icon: Trophy,
    title: "XP & Levels",
    description: "Gamified progress to keep you consistent and motivated.",
  },
]

const comparisonRows = [
  { feature: "AI-personalized protocols", nervsync: true, calm: false, course: false, pulsetto: false },
  { feature: "Nervous system state detection", nervsync: true, calm: false, course: true, pulsetto: true },
  { feature: "Somatic exercises", nervsync: true, calm: false, course: true, pulsetto: false },
  { feature: "Breathwork library", nervsync: true, calm: true, course: false, pulsetto: true },
  { feature: "AI coaching", nervsync: true, calm: false, course: false, pulsetto: false },
  { feature: "No hardware required", nervsync: true, calm: true, course: true, pulsetto: false },
  { feature: "Sleep protocols", nervsync: true, calm: true, course: false, pulsetto: true },
  { feature: "Progress tracking & XP", nervsync: true, calm: false, course: false, pulsetto: false },
  { feature: "Under $15/mo", nervsync: true, calm: false, course: false, pulsetto: false },
]

const testimonials = [
  {
    quote: "I've tried every meditation app out there. NervSync is the first thing that actually helped me understand WHY I feel the way I do -- and gave me something concrete to do about it.",
    name: "Sarah M.",
    role: "Early access user",
  },
  {
    quote: "The SOS mode alone is worth it. I used it during a panic episode and felt my body settle within minutes. Nothing else has worked that fast for me.",
    name: "James K.",
    role: "Early access user",
  },
  {
    quote: "As a therapist, I recommend NervSync to clients who need nervous system support between sessions. The polyvagal-informed approach is exactly right.",
    name: "Dr. Lena R.",
    role: "Early access user",
  },
]

const faqItems = [
  {
    question: "What is NervSync?",
    answer:
      "NervSync is an AI-powered nervous system regulation platform that personalizes breathwork, somatic exercises, and vagal toning protocols to your unique nervous system state. It uses polyvagal theory to detect your state and deliver the right intervention at the right time.",
  },
  {
    question: "How is this different from meditation apps?",
    answer:
      "Traditional meditation apps offer generic content that treats everyone the same. NervSync detects your current nervous system state -- whether you're in fight/flight, freeze, fawn, or dorsal collapse -- and delivers targeted protocols to help you regulate. It's the difference between a generic playlist and a personalized prescription.",
  },
  {
    question: "Do I need any hardware?",
    answer:
      "No. NervSync is entirely software-based. While hardware like HRV monitors can complement your practice, NervSync uses AI-driven check-ins and pattern detection to understand your nervous system state without any wearables or devices.",
  },
  {
    question: "What if I'm in crisis?",
    answer:
      "If you are in immediate danger, please call 911. For emotional crisis, please contact the 988 Suicide & Crisis Lifeline by calling or texting 988. NervSync includes an SOS mode with immediate regulation exercises, but it is a wellness tool, not a substitute for professional mental health care.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your settings page. There are no cancellation fees, no lock-in contracts, and no hidden charges. If you cancel, you will retain access through the end of your current billing period.",
  },
  {
    question: "How long before I feel results?",
    answer:
      "Many users report feeling a shift in their very first session. Nervous system regulation is a skill that builds over time -- most users notice meaningful changes in sleep, stress response, and energy levels within 2-3 weeks of consistent daily practice.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#3B82F6]" />
            <span className="text-xl font-bold">NervSync</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/quiz" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
              Assessment
            </Link>
            <Link href="/pricing" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB] transition-colors"
            >
              Sign In
            </Link>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB] transition-colors md:hidden"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        {/* Pulsing teal circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] animate-pulse rounded-full bg-[#14B8A6] opacity-[0.07]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
            <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Your Nervous System Has a Daily Protocol.
            </span>{" "}
            <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              You Just Haven&apos;t Found It Yet.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94A3B8] md:text-xl">
            AI-personalized breathwork, somatic exercises, and vagal toning. 5 minutes a day. No hardware. No guesswork.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/quiz"
              className="flex items-center gap-2 rounded-xl border border-[#3B82F6] px-6 py-3 text-sm font-semibold text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
            >
              Take the Free Assessment
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/25 hover:bg-[#2563EB] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-[#0F172A] px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl text-[#94A3B8] md:text-2xl leading-relaxed">
            You&apos;ve tried meditation apps. You&apos;ve bought the supplements. But you still feel{" "}
            <span className="text-white font-semibold">wired, foggy, or drained.</span>
          </p>
          <p className="mt-6 text-xl font-semibold text-white md:text-2xl">
            Because you&apos;ve been treating symptoms{" "}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              -- not training your nervous system.
            </span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#1E293B]/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">How It Works</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: 1,
                icon: ClipboardCheck,
                title: "Check In",
                description:
                  "Tell us how you're feeling. Our AI detects your nervous system state in under 60 seconds.",
              },
              {
                step: 2,
                icon: Wand2,
                title: "Get Protocol",
                description:
                  "Receive a personalized breathwork, somatic, or vagal toning exercise matched to your state.",
              },
              {
                step: 3,
                icon: HeartPulse,
                title: "Feel the Shift",
                description:
                  "Follow the guided protocol and experience a measurable shift in your nervous system.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#14B8A6]/20 text-sm font-bold text-[#14B8A6]">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-[#94A3B8]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Everything Your Nervous System Needs
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 transition-colors hover:border-[#3B82F6]/50"
              >
                <feature.icon className="h-6 w-6 text-[#14B8A6]" />
                <h3 className="mt-3 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-[#94A3B8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-[#1E293B]/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            How NervSync Compares
          </h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="pb-4 pr-4 text-[#94A3B8] font-medium">Feature</th>
                  <th className="pb-4 px-4 text-center font-semibold text-[#3B82F6]">NervSync</th>
                  <th className="pb-4 px-4 text-center text-[#94A3B8] font-medium">Calm / Headspace</th>
                  <th className="pb-4 px-4 text-center text-[#94A3B8] font-medium">NS Course</th>
                  <th className="pb-4 px-4 text-center text-[#94A3B8] font-medium">Pulsetto</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-[#334155]/50">
                    <td className="py-3 pr-4 text-[#F8FAFC]">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.nervsync ? (
                        <Check className="mx-auto h-5 w-5 text-emerald-400" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#475569]" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.calm ? (
                        <Check className="mx-auto h-5 w-5 text-emerald-400" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#475569]" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.course ? (
                        <Check className="mx-auto h-5 w-5 text-emerald-400" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#475569]" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.pulsetto ? (
                        <Check className="mx-auto h-5 w-5 text-emerald-400" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-[#475569]" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#94A3B8]">
            Start with a 7-day free trial. Cancel anytime.
          </p>
          <div className="mt-12">
            <PricingCards size="full" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#1E293B]/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            What Early Access Users Say
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-xl border border-[#334155] bg-[#1E293B] p-6"
              >
                <p className="text-[#94A3B8] leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-[#14B8A6]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-12">
            <Accordion type="single" collapsible>
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-[#334155]">
                  <AccordionTrigger className="text-left text-[#F8FAFC] hover:no-underline hover:text-[#3B82F6]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#94A3B8]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#3B82F6]" />
              <span className="font-bold">NervSync</span>
            </div>
            <div className="flex gap-6 text-sm text-[#94A3B8]">
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/quiz" className="hover:text-white transition-colors">
                Assessment
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-[#475569] leading-relaxed">
            NervSync is a wellness product and is not intended to diagnose, treat, cure, or prevent any disease. If you
            are in crisis, contact 988 (Suicide &amp; Crisis Lifeline) or your local emergency services.
          </p>
          <p className="mt-4 text-center text-xs text-[#475569]">
            &copy; {new Date().getFullYear()} NervSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
