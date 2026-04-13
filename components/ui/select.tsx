"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface SelectContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onValueChange: (value: string) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const SelectContext = React.createContext<SelectContextValue | undefined>(
  undefined
)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select provider")
  }
  return context
}

export interface SelectProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

function Select({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
}: SelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const isOpenControlled = controlledOpen !== undefined
  const isValueControlled = controlledValue !== undefined
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen
  const value = isValueControlled ? controlledValue : uncontrolledValue

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isOpenControlled, onOpenChange]
  )

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isValueControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
      handleOpenChange(false)
    },
    [isValueControlled, onValueChange, handleOpenChange]
  )

  return (
    <SelectContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        value,
        onValueChange: handleValueChange,
        triggerRef,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = useSelectContext()

    const composedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (
          triggerRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node
        if (typeof ref === "function") ref(node)
        else if (ref)
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node
      },
      [ref, triggerRef]
    )

    return (
      <button
        ref={composedRef}
        type="button"
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        onClick={(e) => {
          onOpenChange(!open)
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
          className="opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string
  className?: string
}) {
  const { value } = useSelectContext()

  return (
    <span className={cn("pointer-events-none", className)}>
      {value || placeholder}
    </span>
  )
}
SelectValue.displayName = "SelectValue"

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?: "popper" | "item-aligned"
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = useSelectContext()
    const [mounted, setMounted] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({})

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      if (!open || !triggerRef.current) return

      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        minWidth: `${rect.width}px`,
      })
    }, [open, triggerRef])

    React.useEffect(() => {
      if (!open) return

      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          onOpenChange(false)
        }
      }

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false)
        }
      }

      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside)
      }, 0)
      document.addEventListener("keydown", handleEscape)

      return () => {
        clearTimeout(timer)
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }, [open, onOpenChange, triggerRef])

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
          "z-50 max-h-96 overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        style={dropdownStyle}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)
SelectContent.displayName = "SelectContent"

function SelectGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-1", className)} role="group" {...props} />
}
SelectGroup.displayName = "SelectGroup"

function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    />
  )
}
SelectLabel.displayName = "SelectLabel"

export interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, disabled, onClick, ...props }, ref) => {
    const { value, onValueChange } = useSelectContext()
    const isSelected = value === itemValue

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        data-disabled={disabled || undefined}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={(e) => {
          if (disabled) return
          onValueChange(itemValue)
          onClick?.(e)
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
