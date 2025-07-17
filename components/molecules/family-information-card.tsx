"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Edit, Users, Baby, Heart } from "lucide-react"
import { FamilyInformationResponse } from "@/lib/services/profile/family-information.service"
import { InfoCard } from "@/components/atoms/info-card"

interface FamilyInformationCardProps {
  familyInfo: FamilyInformationResponse
  onEdit?: () => void
}

const maritalStateLabels = {
  "SINGLE": "Soltero/a",
  "MARRIED": "Casado/a",
  "DIVORCED": "Divorciado/a",
  "FREE_UNION": "Unión Libre"
}

export function FamilyInformationCard({ 
  familyInfo, 
  onEdit 
}: FamilyInformationCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "No disponible"
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-purple-700">Información Familiar</CardTitle>
              <p className="text-sm text-neutral-600">Estado civil y familia</p>
            </div>
          </div>
          {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={Heart}
            label="Estado Civil"
            value={
              <Badge variant="outline" className="w-fit">
                {maritalStateLabels[familyInfo.maritalState]}
              </Badge>
            }
          />
          
          <InfoCard
            icon={Baby}
            label="Número de Hijos"
            value={familyInfo.childNumber.toString()}
          />
        </div>
        
        <div className="pt-4 border-t mt-4">
          <p className="text-xs text-neutral-500">
            Última actualización: {formatDate(familyInfo.lastUpdate)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 