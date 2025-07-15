import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import { DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { PostGraduateInfoCard } from "@/components/atoms/post-graduate-info-card"

interface PostGraduateCardProps {
  postGraduate: DetailedAcademicEducationResponse
  index: number
  onEdit: (item: DetailedAcademicEducationResponse) => void
  isViewOnly?: boolean
}

export function PostGraduateCard({ 
  postGraduate, 
  index, 
  onEdit,
  isViewOnly = false
}: PostGraduateCardProps) {
  return (
    <PostGraduateInfoCard
      studyType={postGraduate.type || "No disponible"}
      institution={postGraduate.institution || "No disponible"}
      studyName={postGraduate.studyName || "No disponible"}
      country={postGraduate.country || "No disponible"}
      index={index}
      color="purple"
      showEditButton={!isViewOnly}
      onEdit={() => onEdit(postGraduate)}
    />
  )
} 