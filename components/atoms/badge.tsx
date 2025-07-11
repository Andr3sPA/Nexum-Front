"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "border-transparent bg-[#026937] text-white hover:bg-[#35944b]",
      secondary: "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
      destructive: "border-transparent bg-[#ef434d] text-white hover:bg-red-600",
      outline: "text-neutral-950 border-neutral-300",
    }

    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
