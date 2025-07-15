"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown, Lightbulb } from "lucide-react"
import { Badge } from "@/components/atoms/badge"

export interface EvaluationSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  items: string[]
  type: "strengths" | "weaknesses" | "suggestions"
  color?: "blue" | "green" | "purple" | "orange"
}

const EvaluationSection = React.forwardRef<HTMLDivElement, EvaluationSectionProps>(
  ({ className, title, items, type, color = "blue", ...props }, ref) => {
    const getTypeConfig = () => {
      switch (type) {
        case "strengths":
          return {
            icon: TrendingUp,
            bg: "bg-green-50",
            border: "border-green-200",
            iconColor: "text-green-600",
            badgeColor: "bg-green-100 text-green-700"
          }
        case "weaknesses":
          return {
            icon: TrendingDown,
            bg: "bg-red-50",
            border: "border-red-200",
            iconColor: "text-red-600",
            badgeColor: "bg-red-100 text-red-700"
          }
        case "suggestions":
          return {
            icon: Lightbulb,
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            iconColor: "text-yellow-600",
            badgeColor: "bg-yellow-100 text-yellow-700"
          }
        default:
          return {
            icon: TrendingUp,
            bg: "bg-blue-50",
            border: "border-blue-200",
            iconColor: "text-blue-600",
            badgeColor: "bg-blue-100 text-blue-700"
          }
      }
    }

    const config = getTypeConfig()
    const Icon = config.icon

    if (!items || items.length === 0) {
      return null
    }

    return (
      <div
        className={cn(
          "p-4 rounded-lg border",
          config.bg,
          config.border,
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon className={cn("h-4 w-4", config.iconColor)} />
          <h4 className="font-medium text-sm text-neutral-700">{title}</h4>
          <Badge variant="outline" className={config.badgeColor}>
            {items.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 bg-white rounded border border-neutral-200"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
              <p className="text-sm text-neutral-700 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
EvaluationSection.displayName = "EvaluationSection"

export { EvaluationSection } 