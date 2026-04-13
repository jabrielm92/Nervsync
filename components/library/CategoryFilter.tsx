"use client"

import { useRef } from "react"

interface CategoryFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
            active === category
              ? "bg-[#3B82F6] text-white"
              : "bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#3B82F6]/40 hover:text-[#F8FAFC]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
