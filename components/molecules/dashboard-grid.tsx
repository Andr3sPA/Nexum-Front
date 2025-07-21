import React from "react"
import { cn } from "@/lib/utils"
import { DashboardCard } from "@/components/atoms/dashboard-card"

export interface DashboardCardData {
  href?: string
  icon: React.ReactNode
  title: string
  description: string
  color: "blue" | "green" | "purple" | "yellow" | "red" | "indigo" | "orange"
  disabled?: boolean
  onClick?: () => void
  isButton?: boolean
}

export interface DashboardGridProps {
  cards: DashboardCardData[]
  className?: string
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ cards, className }) => {
  // Determinar el número de columnas basado en la cantidad de tarjetas
  const getGridCols = () => {
    if (cards.length === 1) return "grid-cols-1"
    if (cards.length === 2) return "grid-cols-1 md:grid-cols-2"
    if (cards.length >= 3) return "grid-cols-1 md:grid-cols-3"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  return (
    <div className={cn(
      "grid gap-6 mt-8",
      getGridCols(),
      className
    )}>
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          href={card.href}
          icon={card.icon}
          title={card.title}
          description={card.description}
          color={card.color}
          disabled={card.disabled}
          onClick={card.onClick}
          isButton={card.isButton}
        />
      ))}
    </div>
  )
} 