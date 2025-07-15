"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { AddButton } from "@/components/atoms/add-button"

export interface EmptyStateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  actionText: string
  onAction: () => void
  color?: "blue" | "green" | "purple" | "orange"
}

const EmptyStateCard = React.forwardRef<HTMLDivElement, EmptyStateCardProps>(
  ({ 
    className, 
    icon: Icon, 
    title, 
    description, 
    actionText, 
    onAction, 
    color = "blue",
    ...props 
  }, ref) => {
    const getColorClasses = () => {
      switch (color) {
        case "green":
          return {
            border: "border-l-green-500",
            bg: "bg-green-100",
            icon: "text-green-600",
            title: "text-green-700"
          }
        case "blue":
          return {
            border: "border-l-blue-500",
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
        case "purple":
          return {
            border: "border-l-purple-500",
            bg: "bg-purple-100",
            icon: "text-purple-600",
            title: "text-purple-700"
          }
        case "orange":
          return {
            border: "border-l-orange-500",
            bg: "bg-orange-100",
            icon: "text-orange-600",
            title: "text-orange-700"
          }
        default:
          return {
            border: "border-l-blue-500",
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
      }
    }

    const colors = getColorClasses()

    return (
      <Card className={cn("border-l-4", colors.border)} ref={ref} {...props}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colors.bg)}>
              <Icon className={cn("h-5 w-5", colors.icon)} />
            </div>
            <div>
              <CardTitle className={cn("text-lg", colors.title)}>
                {title}
              </CardTitle>
              <p className="text-sm text-neutral-600">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-start">
            <AddButton onClick={onAction}>
              {actionText}
            </AddButton>
          </div>
        </CardContent>
      </Card>
    )
  }
)
EmptyStateCard.displayName = "EmptyStateCard"

export { EmptyStateCard } 