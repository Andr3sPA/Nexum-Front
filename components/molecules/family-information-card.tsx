"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Users, Baby } from "lucide-react"
import { FamilyInformationResponse } from "@/lib/services/profile/family-information.service"

interface FamilyInformationCardProps {
  familyInfo: FamilyInformationResponse
  onEdit: () => void
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Información Familiar</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Estado Civil</p>
            <Badge variant="outline" className="w-fit">
              {maritalStateLabels[familyInfo.maritalState]}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Número de Hijos</p>
            <div className="flex items-center space-x-1">
              <Baby className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-medium">{familyInfo.childNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Última actualización: {formatDate(familyInfo.lastUpdate)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 