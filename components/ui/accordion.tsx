"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionContextValue {
  type: "single" | "multiple"
  value: string[]
  onValueChange: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
)

function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error(
      "Accordion components must be used within an Accordion provider"
    )
  }
  return context
}

export interface AccordionSingleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  collapsible?: boolean
}

export interface AccordionMultipleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (props, ref) => {
    const { type, className, children, ...rest } = props

    const [internalValue, setInternalValue] = React.useState<string[]>(() => {
      if (type === "single") {
        const p = props as AccordionSingleProps
        const val = p.value ?? p.defaultValue
        return val ? [val] : []
      } else {
        const p = props as AccordionMultipleProps
        const val = p.value ?? p.defaultValue
        return val ?? []
      }
    })

    const isControlled =
      type === "single"
        ? (props as AccordionSingleProps).value !== undefined
        : (props as AccordionMultipleProps).value !== undefined

    const currentValue = React.useMemo(() => {
      if (isControlled) {
        if (type === "single") {
          const val = (props as AccordionSingleProps).value
          return val ? [val] : []
        } else {
          return (props as AccordionMultipleProps).value ?? []
        }
      }
      return internalValue
    }, [isControlled, type, props, internalValue])

    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        if (type === "single") {
          const p = props as AccordionSingleProps
          const collapsible = p.collapsible ?? false
          const newValue =
            currentValue.includes(itemValue) && collapsible ? [] : [itemValue]

          if (!isControlled) {
            setInternalValue(newValue)
          }
          p.onValueChange?.(newValue[0] ?? "")
        } else {
          const p = props as AccordionMultipleProps
          const newValue = currentValue.includes(itemValue)
            ? currentValue.filter((v) => v !== itemValue)
            : [...currentValue, itemValue]

          if (!isControlled) {
            setInternalValue(newValue)
          }
          p.onValueChange?.(newValue)
        }
      },
      [type, props, currentValue, isControlled]
    )

    // Remove non-DOM props before spreading
    const {
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      collapsible: _collapsible,
      ...domProps
    } = rest as Record<string, unknown>

    return (
      <AccordionContext.Provider
        value={{ type, value: currentValue, onValueChange: handleValueChange }}
      >
        <div
          ref={ref}
          className={cn("w-full", className)}
          {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const AccordionItemContext = React.createContext<
  AccordionItemContextValue | undefined
>(undefined)

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext)
  if (!context) {
    throw new Error(
      "AccordionTrigger/AccordionContent must be used within an AccordionItem"
    )
  }
  return context
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => {
    const accordion = useAccordionContext()
    const isOpen = accordion.value.includes(value)

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div
          ref={ref}
          className={cn("border-b", className)}
          data-state={isOpen ? "open" : "closed"}
          {...props}
        />
      </AccordionItemContext.Provider>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const accordion = useAccordionContext()
  const item = useAccordionItemContext()

  return (
    <h3 className="flex">
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-state={item.isOpen ? "open" : "closed"}
        aria-expanded={item.isOpen}
        onClick={(e) => {
          accordion.onValueChange(item.value)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-200"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h3>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const item = useAccordionItemContext()

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        item.isOpen
          ? "animate-accordion-down"
          : "hidden",
        className
      )}
      data-state={item.isOpen ? "open" : "closed"}
      role="region"
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
