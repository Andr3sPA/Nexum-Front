"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, title, defaultOpen = false, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
      <div ref={ref} className={cn("border rounded-lg", className)} {...props}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg border-b transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {isOpen && (
          <div className="p-4">
            {children}
          </div>
        )}
      </div>
    )
  }
)
Collapsible.displayName = "Collapsible"

export { Collapsible }