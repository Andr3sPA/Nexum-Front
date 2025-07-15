"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: boolean
  trueText?: string
  falseText?: string
  variant?: "default" | "success" | "destructive"
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ 
    className, 
    status, 
    trueText = "Sí", 
    falseText = "No", 
    variant = "default",
    ...props 
  }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "success":
          return status 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        case "destructive":
          return status 
            ? "bg-red-100 text-red-700" 
            : "bg-green-100 text-green-700"
        default:
          return status 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
      }
    }

    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          getVariantClasses(),
          className
        )}
        ref={ref}
        {...props}
      >
        {status ? trueText : falseText}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge } 