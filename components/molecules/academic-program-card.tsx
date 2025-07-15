import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { DataField } from "@/components/atoms/data-field"
import { EvaluationDisplay } from "@/components/molecules/evaluation-display"
import { EditButton } from "@/components/atoms/edit-button"
import { DetailedCoursedProgramResponse } from "@/lib/services/profile/detailed-user.service"
import { AcademicInfoCard } from "@/components/atoms/academic-info-card"

interface AcademicProgramCardProps {
  program: DetailedCoursedProgramResponse
  index: number
  getProgramName: (programVersionId: number) => string
  onEdit?: () => void
  isViewOnly?: boolean
}

export function AcademicProgramCard({ 
  program, 
  index, 
  getProgramName,
  onEdit,
  isViewOnly = false
}: AcademicProgramCardProps) {
  return (
    <AcademicInfoCard
      programName={getProgramName(program.programVersion.id)}
      graduationYear={program.graduationYear?.toString() || "No disponible"}
      programVersion={program.programVersion?.name || "No disponible"}
      index={index}
      strengths={program.strengths || []}
      weaknesses={program.weaknesses || []}
      improvementSuggestions={program.improvementSuggestions || []}
      color="blue"
      showEditButton={!isViewOnly}
      onEdit={onEdit}
    />
  )
} 