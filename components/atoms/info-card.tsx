"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  label: string
  value: string | React.ReactNode
  iconClassName?: string
}

const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ className, icon: Icon, label, value, iconClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 bg-neutral-50 rounded-lg",
          className
        )}
        ref={ref}
        {...props}
      >
        <Icon className={cn("h-4 w-4 text-neutral-500", iconClassName)} />
        <div>
          <p className="text-xs text-neutral-500 font-medium">{label}</p>
          <div className="text-sm font-medium">{value}</div>
        </div>
      </div>
    )
  }
)
InfoCard.displayName = "InfoCard"

export { InfoCard } 