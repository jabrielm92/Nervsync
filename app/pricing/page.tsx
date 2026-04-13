"use client"

import Link from "next/link"
import { Zap, Check } from "lucide-react"
import PricingCards from "@/components/marketing/PricingCards"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const allFeatures = [
  "Unlimited AI-personalized sessions",
  "50+ breathwork & somatic protocols",
  "AI Nervous System Coach",
  "Daily check-ins & regulation scoring",
  "Sleep protocols & wind-down routines",
  "SOS Mode for acute stress",
  "Somatic journal with AI reflections",
  "Weekly insights & trend analysis",
  "Structured multi-week programs",
  "XP, levels, and streaks",
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

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      {/* Header */}
      <nav className="border-b border-[#1E293B] px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#3B82F6]" />
            <span className="font-bold">NervSync</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/quiz" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
              Assessment
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#94A3B8]">
          Start with a 7-day free trial. Cancel anytime. No hidden fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-16">
        <PricingCards size="full" />
      </section>

      {/* All Features */}
      <section className="bg-[#1E293B]/30 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold">Everything included:</h2>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {allFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-[#14B8A6]" />
                <span className="text-[#94A3B8]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-10">
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
      <footer className="border-t border-[#1E293B] px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs text-[#475569] leading-relaxed">
            NervSync is a wellness product and is not intended to diagnose, treat, cure, or prevent
            any disease. If you are in crisis, contact 988 (Suicide &amp; Crisis Lifeline) or your
            local emergency services.
          </p>
          <p className="mt-4 text-center text-xs text-[#475569]">
            &copy; {new Date().getFullYear()} NervSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
