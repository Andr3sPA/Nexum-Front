import React from "react"
import { cn } from "@/lib/utils"

export interface ReportStatCardProps {
  title: string
  value: number | string
  subtitle?: string
  info?: string
  variant?: "primary" | "secondary" | "success" | "warning" | "info"
  className?: string
}

const variantStyles = {
  primary: "bg-blue-50 border-blue-200 text-blue-700",
  secondary: "bg-gray-50 border-gray-200 text-gray-700",
  success: "bg-green-50 border-green-200 text-green-700",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
  info: "bg-purple-50 border-purple-200 text-purple-700"
}

export const ReportStatCard: React.FC<ReportStatCardProps> = ({
  title,
  value,
  subtitle,
  info,
  variant = "primary",
  className
}) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
      variantStyles[variant],
      className
    )}>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">{title}</div>
        {info && (
          <div title={info} aria-label={info} className="text-xs text-gray-500" style={{ lineHeight: 1 }}>
            ⓘ
          </div>
        )}
      </div>
      {subtitle && (
        <div className="text-xs opacity-75 mt-1">{subtitle}</div>
      )}
    </div>
  )
} 