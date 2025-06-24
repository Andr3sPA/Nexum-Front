"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to get the nonce from the DOM
function getNonce(): string {
  if (typeof document !== 'undefined') {
    const rootElement = document.getElementById('root');
    return rootElement?.getAttribute('data-nonce') || '';
  }
  return '';
}

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  triggerClassName?: string
  contentClassName?: string
  itemClassName?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  triggerClassName,
  contentClassName,
  itemClassName,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)
  const selectedOption = options.find(option => option.value === value)
  const nonce = getNonce()

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        
        const currentIndex = value ? options.findIndex(option => option.value === value) : -1
        const nextIndex = e.key === "ArrowDown"
          ? (currentIndex + 1) % options.length
          : (currentIndex - 1 + options.length) % options.length
        
        onChange(options[nextIndex].value)
      } else if (e.key === "Enter" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, options, value, onChange])

  return (
    <div className={cn("relative w-full", className)} ref={selectRef} nonce={nonce}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          triggerClassName
        )}
        nonce={nonce}
      >
        <span className={!selectedOption ? "text-muted-foreground" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg",
            contentClassName
          )}
          role="listbox"
          nonce={nonce}
        >
          {options.map((option) => (
            <div
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                value === option.value && "bg-accent text-accent-foreground",
                itemClassName
              )}
              nonce={nonce}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center" nonce={nonce}>
                {value === option.value && <Check className="h-4 w-4" />}
              </span>
              <span nonce={nonce}>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const SelectGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const nonce = getNonce()
  return <div className={cn("space-y-1", className)} nonce={nonce} {...props} />
}

export const SelectLabel: React.FC<React.HTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => {
  const nonce = getNonce()
  return <label id="select-label" className={cn("text-sm font-medium", className)} nonce={nonce} {...props} />
}