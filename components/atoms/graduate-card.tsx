"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"

export interface GraduateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  graduate: {
    id: string
    name: string
    middleName?: string
    lastname: string
    secondLastname?: string
    email?: string
    academicEmail?: string
    programs?: Array<{ name: string }>
    country?: string
    city?: string
    gender?: string
  }
  onViewProfile: (id: string) => void
}

const GraduateCard = React.forwardRef<HTMLDivElement, GraduateCardProps>(
  ({ 
    className, 
    graduate,
    onViewProfile,
    ...props 
  }, ref) => {
    const fullName = `${graduate.name} ${graduate.middleName || ''} ${graduate.lastname} ${graduate.secondLastname || ''}`.trim()
    const email = graduate.email || graduate.academicEmail

    return (
      <Card 
        className={cn("border shadow-sm hover:shadow-md transition-shadow", className)} 
        ref={ref} 
        {...props}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold udea-primary-text">
            {fullName}
          </CardTitle>
          <CardDescription>
            {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Programa:</span> 
              {graduate.programs?.map(p => p.name).join(", ") || "No especificado"}
            </div>
            <div>
              <span className="font-medium text-gray-600">País:</span> 
              {graduate.country || "No especificado"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Ciudad:</span> 
              {graduate.city || "No especificado"}
            </div>
            <div>
              <span className="font-medium text-gray-600">Género:</span> 
              {graduate.gender || "No especificado"}
            </div>
          </div>
          <div className="pt-3 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewProfile(graduate.id)}
              className="w-full"
            >
              Ver Perfil Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
)
GraduateCard.displayName = "GraduateCard"

export { GraduateCard } 