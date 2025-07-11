import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import { DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"

interface PostGraduateCardProps {
  postGraduate: DetailedAcademicEducationResponse
  index: number
  onEdit: (item: DetailedAcademicEducationResponse) => void
}

export function PostGraduateCard({ 
  postGraduate, 
  index, 
  onEdit 
}: PostGraduateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Badge variant="outline">Estudio Post Graduación {index + 1}</Badge>
          <EditButton onClick={() => onEdit(postGraduate)} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField 
            label="Tipo de Estudio" 
            value={postGraduate.type || "No disponible"} 
          />
          <DataField 
            label="Institución" 
            value={postGraduate.institution || "No disponible"} 
          />
          <DataField 
            label="Nombre del Estudio" 
            value={postGraduate.studyName || "No disponible"} 
          />
          <DataField 
            label="País" 
            value={postGraduate.country || "No disponible"} 
          />
        </div>
      </CardContent>
    </Card>
  )
} 