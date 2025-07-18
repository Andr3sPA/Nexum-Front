import React from "react"
import { Card, CardContent, CardHeader } from "@/components/molecules/card"
import { WelcomeHeader } from "@/components/atoms/welcome-header"
import { DashboardGrid, DashboardCardData } from "@/components/molecules/dashboard-grid"
import { ROLES } from "@/lib/services/constants/api.constants"

export interface DashboardContainerProps {
  role?: string
  cards: DashboardCardData[]
  className?: string
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ 
  role, 
  cards, 
  className 
}) => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <WelcomeHeader role={role} />
          </CardHeader>
          <CardContent>
            <DashboardGrid cards={cards} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 