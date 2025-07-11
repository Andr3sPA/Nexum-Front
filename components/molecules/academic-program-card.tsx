import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { DataField } from "@/components/atoms/data-field"
import { EvaluationDisplay } from "@/components/molecules/evaluation-display"
import { DetailedCoursedProgramResponse } from "@/lib/services/profile/detailed-user.service"

interface AcademicProgramCardProps {
  program: DetailedCoursedProgramResponse
  index: number
  getProgramName: (programVersionId: number) => string
}

export function AcademicProgramCard({ 
  program, 
  index, 
  getProgramName 
}: AcademicProgramCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Programa {index + 1}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField 
            label="Programa" 
            value={getProgramName(program.programVersion.id)} 
          />
          <DataField 
            label="Año de Graduación" 
            value={program.graduationYear?.toString() || "No disponible"} 
          />
          {program.programVersion && (
            <DataField 
              label="Versión del Programa" 
              value={program.programVersion.name || "No disponible"} 
            />
          )}
        </div>

        <EvaluationDisplay 
          title="Fortalezas" 
          items={program.strengths || []} 
        />
        
        <EvaluationDisplay 
          title="Debilidades" 
          items={program.weaknesses || []} 
        />
        
        <EvaluationDisplay 
          title="Sugerencias de Mejora" 
          items={program.improvementSuggestions || []} 
        />
      </CardContent>
    </Card>
  )
} 