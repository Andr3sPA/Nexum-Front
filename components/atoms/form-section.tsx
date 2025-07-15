"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  children: React.ReactNode
  color?: "blue" | "green" | "purple" | "orange"
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, icon: Icon, title, description, children, color = "blue", ...props }, ref) => {
    const getColorClasses = () => {
      switch (color) {
        case "green":
          return {
            border: "border-green-200",
            bg: "bg-green-50",
            icon: "text-green-600",
            title: "text-green-700"
          }
        case "blue":
          return {
            border: "border-blue-200",
            bg: "bg-blue-50",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
        case "purple":
          return {
            border: "border-purple-200",
            bg: "bg-purple-50",
            icon: "text-purple-600",
            title: "text-purple-700"
          }
        case "orange":
          return {
            border: "border-orange-200",
            bg: "bg-orange-50",
            icon: "text-orange-600",
            title: "text-orange-700"
          }
        default:
          return {
            border: "border-blue-200",
            bg: "bg-blue-50",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
      }
    }

    const colors = getColorClasses()

    return (
      <div
        className={cn(
          "p-4 rounded-lg border",
          colors.border,
          colors.bg,
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2 mb-4">
          {Icon && (
            <Icon className={cn("h-4 w-4", colors.icon)} />
          )}
          <h3 className={cn("font-medium text-sm", colors.title)}>
            {title}
          </h3>
        </div>
        
        {description && (
          <p className="text-xs text-gray-600 mb-4">
            {description}
          </p>
        )}
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    )
  }
)
FormSection.displayName = "FormSection"

export { FormSection } 