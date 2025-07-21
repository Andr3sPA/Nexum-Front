import React from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export interface DashboardCardProps {
  href?: string
  icon: React.ReactNode
  title: string
  description: string
  color: "blue" | "green" | "purple" | "yellow" | "red" | "indigo" | "orange"
  disabled?: boolean
  onClick?: () => void
  isButton?: boolean
  className?: string
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50",
    hover: "hover:bg-blue-100",
    border: "border-blue-200",
    borderHover: "hover:border-blue-300",
    text: "text-blue-600",
    textHover: "group-hover:text-blue-700"
  },
  green: {
    bg: "bg-green-50",
    hover: "hover:bg-green-100",
    border: "border-green-200",
    borderHover: "hover:border-green-300",
    text: "text-green-600",
    textHover: "group-hover:text-green-700"
  },
  purple: {
    bg: "bg-purple-50",
    hover: "hover:bg-purple-100",
    border: "border-purple-200",
    borderHover: "hover:border-purple-300",
    text: "text-purple-600",
    textHover: "group-hover:text-purple-700"
  },
  yellow: {
    bg: "bg-yellow-50",
    hover: "hover:bg-yellow-100",
    border: "border-yellow-200",
    borderHover: "hover:border-yellow-300",
    text: "text-yellow-600",
    textHover: "group-hover:text-yellow-700"
  },
  red: {
    bg: "bg-red-50",
    hover: "hover:bg-red-100",
    border: "border-red-200",
    borderHover: "hover:border-red-300",
    text: "text-red-600",
    textHover: "group-hover:text-red-700"
  },
  indigo: {
    bg: "bg-indigo-50",
    hover: "hover:bg-indigo-100",
    border: "border-indigo-200",
    borderHover: "hover:border-indigo-300",
    text: "text-indigo-600",
    textHover: "group-hover:text-indigo-700"
  },
  orange: {
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
    border: "border-orange-200",
    borderHover: "hover:border-orange-300",
    text: "text-orange-600",
    textHover: "group-hover:text-orange-700"
  }
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  href,
  icon,
  title,
  description,
  color,
  disabled = false,
  onClick,
  isButton = false,
  className
}) => {
  const colors = colorStyles[color]
  
  const cardContent = (
    <div className={cn(
      "p-6 rounded-lg transition-all duration-200 cursor-pointer flex flex-col items-center justify-between h-full",
      colors.bg,
      colors.hover,
      colors.border,
      colors.borderHover,
      disabled && "opacity-60 pointer-events-none",
      className
    )}>
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center flex-1">
        {description}
      </p>
      <div className={cn(
        "flex items-center justify-center",
        colors.text,
        colors.textHover
      )}>
        <span className="text-sm font-medium">
          {isButton ? "Registrar Nuevo" : "Ir"}
        </span>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  )

  if (isButton && onClick) {
    return (
      <div 
        className="group"
        onClick={onClick}
      >
        {cardContent}
      </div>
    )
  }

  if (href) {
    return (
      <Link 
        href={href}
        className={cn(
          "group",
          disabled && "pointer-events-none"
        )}
      >
        {cardContent}
      </Link>
    )
  }

  return cardContent
} 