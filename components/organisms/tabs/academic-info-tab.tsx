"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditButton } from "@/components/atoms/edit-button"
import { AddButton } from "@/components/atoms/add-button"
import { SectionTitle } from "@/components/atoms/section-title"
import { DataField } from "@/components/atoms/data-field"
import { AcademicInfoModal } from "@/components/organisms/modals/academic-info-modal"
import { PostGraduateModal } from "@/components/organisms/modals/post-graduate-modal"
import { AcademicProgramCard } from "@/components/molecules/academic-program-card"
import { PostGraduateCard } from "@/components/molecules/post-graduate-card"
import { useAcademic } from "@/contexts/academic-context"
import { logger } from "@/lib/logging"
import { DetailedCoursedProgramResponse, DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { Label } from "@/components/ui/label"

interface AcademicInfoTabProps {
  academicData: DetailedCoursedProgramResponse[]
  postGraduateData: DetailedAcademicEducationResponse[]
  onDataUpdate: () => void
}

export function AcademicInfoTab({ 
  academicData, 
  postGraduateData, 
  onDataUpdate 
}: AcademicInfoTabProps) {
  const { programs } = useAcademic()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPostGraduateModalOpen, setIsPostGraduateModalOpen] = useState(false)
  const [editingPostGraduate, setEditingPostGraduate] = useState<DetailedAcademicEducationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Memoize the program lookup map
  const programMap = useMemo(() => {
    const map = new Map()
    if (Array.isArray(programs)) {
      programs.forEach(program => {
        map.set(program.id, program)
      })
    }
    return map
  }, [programs])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      onDataUpdate()
    } catch (error) {
      logger.error("Error updating academic data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostGraduateSave = async () => {
    try {
      setIsLoading(true)
      onDataUpdate()
    } catch (error) {
      logger.error("Error updating post-graduate data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPostGraduate = (item: DetailedAcademicEducationResponse) => {
    setEditingPostGraduate(item)
    setIsPostGraduateModalOpen(true)
  }

  const handleAddPostGraduate = () => {
    setEditingPostGraduate(null)
    setIsPostGraduateModalOpen(true)
  }

  const handleClosePostGraduateModal = () => {
    setIsPostGraduateModalOpen(false)
    setEditingPostGraduate(null)
  }

  const getProgramName = (programVersionId: number) => {
    // For now, we'll use the program version name directly
    // In a real implementation, you might want to fetch the program name
    // based on the program version ID from the backend
    return "Programa UdeA" // Placeholder
  }

  if (!Array.isArray(academicData)) {
    return (
      <div className="space-y-6">
        <SectionTitle>Información Académica</SectionTitle>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No hay información académica disponible.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionTitle>Información Académica</SectionTitle>
        <EditButton onClick={() => setIsModalOpen(true)} />
      </div>

      {academicData.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No hay información académica registrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {academicData.map((academic, index) => (
            <AcademicProgramCard
              key={index}
              program={academic}
              index={index}
              getProgramName={getProgramName}
            />
          ))}
        </div>
      )}

      {/* Post Graduate Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SectionTitle>Estudios Post Graduación</SectionTitle>
          <AddButton onClick={handleAddPostGraduate} />
        </div>
        
        {Array.isArray(postGraduateData) && postGraduateData.length > 0 ? (
          <div className="space-y-4">
            {postGraduateData.map((postGrad, index) => (
              <PostGraduateCard
                key={index}
                postGraduate={postGrad}
                index={index}
                onEdit={handleEditPostGraduate}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No hay estudios post graduación registrados.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AcademicInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        academicData={academicData}
        postGraduateData={postGraduateData}
      />

      <PostGraduateModal
        isOpen={isPostGraduateModalOpen}
        onClose={handleClosePostGraduateModal}
        onSave={handlePostGraduateSave}
        postGraduateData={postGraduateData}
        editingItem={editingPostGraduate}
      />
    </div>
  )
}
