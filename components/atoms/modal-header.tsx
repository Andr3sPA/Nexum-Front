"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  subtitle?: string
  color?: "blue" | "green" | "purple" | "orange"
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, icon: Icon, title, subtitle, color = "blue", ...props }, ref) => {
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
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
      }
    }

    const colors = getColorClasses()

    return (
      <div
        className={cn(
          "flex items-center gap-4 p-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className={cn("p-3 rounded-xl", colors.bg)}>
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
        <div className="flex-1">
          <h2 className={cn("text-xl font-semibold leading-none tracking-tight", colors.title)}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    )
  }
)
ModalHeader.displayName = "ModalHeader"

export { ModalHeader } 