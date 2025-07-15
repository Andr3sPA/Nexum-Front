"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { CardTitle } from "@/components/molecules/card"

export interface JobHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  companyName: string
  position: string
  color: "green" | "blue" | "purple" | "orange"
}

const JobHeader = React.forwardRef<HTMLDivElement, JobHeaderProps>(
  ({ className, icon: Icon, companyName, position, color, ...props }, ref) => {
    const getColorClasses = () => {
      switch (color) {
        case "green":
          return {
            bg: "bg-green-100",
            icon: "text-green-600",
            title: "text-green-700"
          }
        case "blue":
          return {
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
        case "purple":
          return {
            bg: "bg-purple-100",
            icon: "text-purple-600",
            title: "text-purple-700"
          }
        case "orange":
          return {
            bg: "bg-orange-100",
            icon: "text-orange-600",
            title: "text-orange-700"
          }
        default:
          return {
            bg: "bg-green-100",
            icon: "text-green-600",
            title: "text-green-700"
          }
      }
    }

    const colors = getColorClasses()

    return (
      <div
        className={cn("flex items-center gap-3", className)}
        ref={ref}
        {...props}
      >
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        <div>
          <CardTitle className={cn("text-lg", colors.title)}>
            {companyName}
          </CardTitle>
          <p className="text-sm text-neutral-600">{position}</p>
        </div>
      </div>
    )
  }
)
JobHeader.displayName = "JobHeader"

export { JobHeader } 