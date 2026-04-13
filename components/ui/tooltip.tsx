"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface TooltipProviderContextValue {
  delayDuration: number
}

const TooltipProviderContext = React.createContext<TooltipProviderContextValue>({
  delayDuration: 200,
})

export interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
}

function TooltipProvider({
  children,
  delayDuration = 200,
}: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipProviderContext.Provider>
  )
}

interface TooltipContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  delayDuration: number
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(
  undefined
)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error(
      "Tooltip components must be used within a Tooltip provider"
    )
  }
  return context
}

export interface TooltipProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  children: React.ReactNode
}

function Tooltip({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delayDuration: propDelay,
  children,
}: TooltipProps) {
  const providerContext = React.useContext(TooltipProviderContext)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const triggerRef = React.useRef<HTMLElement>(null)
  const delayDuration = propDelay ?? providerContext.delayDuration

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value)
      }
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <TooltipContext.Provider
      value={{ open, onOpenChange: handleOpenChange, triggerRef, delayDuration }}
    >
      {children}
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
  const { onOpenChange, triggerRef, delayDuration } = useTooltipContext()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const composedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
      if (typeof ref === "function") ref(node)
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [ref, triggerRef]
  )

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    timeoutRef.current = setTimeout(() => {
      onOpenChange(true)
    }, delayDuration)
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    onOpenChange(false)
    onMouseLeave?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    onOpenChange(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    onOpenChange(false)
    onBlur?.(e)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <button
      ref={composedRef}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", sideOffset = 4, children, ...props }, ref) => {
    const { open, triggerRef } = useTooltipContext()
    const [mounted, setMounted] = React.useState(false)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      if (!open || !triggerRef.current) return

      const trigger = triggerRef.current
      const rect = trigger.getBoundingClientRect()

      const calculatePosition = () => {
        const contentEl = contentRef.current
        const contentWidth = contentEl?.offsetWidth ?? 0
        const contentHeight = contentEl?.offsetHeight ?? 0

        switch (side) {
          case "top":
            setPosition({
              top: rect.top - contentHeight - sideOffset + window.scrollY,
              left:
                rect.left +
                rect.width / 2 -
                contentWidth / 2 +
                window.scrollX,
            })
            break
          case "bottom":
            setPosition({
              top: rect.bottom + sideOffset + window.scrollY,
              left:
                rect.left +
                rect.width / 2 -
                contentWidth / 2 +
                window.scrollX,
            })
            break
          case "left":
            setPosition({
              top:
                rect.top +
                rect.height / 2 -
                contentHeight / 2 +
                window.scrollY,
              left: rect.left - contentWidth - sideOffset + window.scrollX,
            })
            break
          case "right":
            setPosition({
              top:
                rect.top +
                rect.height / 2 -
                contentHeight / 2 +
                window.scrollY,
              left: rect.right + sideOffset + window.scrollX,
            })
            break
        }
      }

      // Initial calculation with a frame delay to allow content to render
      requestAnimationFrame(calculatePosition)
    }, [open, side, sideOffset, triggerRef])

    if (!mounted || !open) return null

    return createPortal(
      <div
        ref={(node) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node
          if (typeof ref === "function") ref(node)
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          pointerEvents: "none",
        }}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
