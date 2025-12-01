"use client"

import React, { useState, useEffect, useMemo } from "react"
import { TabContainer, TabSection, TabEmptyState, TabListContainer } from "@/components/organisms/tab-container"
import { AcademicInfoModal } from "@/components/organisms/modals/academic-info-modal"
import { PostGraduateModal } from "@/components/organisms/modals/post-graduate-modal"
import { AcademicProgramCard } from "@/components/molecules/academic-program-card"
import { PostGraduateCard } from "@/components/molecules/post-graduate-card"
import { EmptyStateCard } from "@/components/atoms/empty-state-card"
import { useAcademic } from "@/contexts/academic-context"
import { logger } from "@/lib/logging"
import { DetailedCoursedProgramResponse, DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { GraduationCap, BookOpen } from "lucide-react"

interface AcademicInfoTabProps {
  academicData: DetailedCoursedProgramResponse[]
  postGraduateData: DetailedAcademicEducationResponse[]
  isViewOnly?: boolean
  onDataUpdate?: () => Promise<void>
  userId: string
}

export function AcademicInfoTab({ 
  academicData, 
  postGraduateData, 
  isViewOnly = false,
  onDataUpdate,
  userId
}: AcademicInfoTabProps) {
  const { programs } = useAcademic()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPostGraduateModalOpen, setIsPostGraduateModalOpen] = useState(false)
  const [editingPostGraduate, setEditingPostGraduate] = useState<DetailedAcademicEducationResponse | null>(null)
  const [editingAcademicProgram, setEditingAcademicProgram] = useState<DetailedCoursedProgramResponse | null>(null)
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
      if (onDataUpdate) {
        await onDataUpdate()
      }
    } catch (error) {
      logger.error("Error updating academic data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostGraduateSave = async () => {
    try {
      setIsLoading(true)
      if (onDataUpdate) {
        await onDataUpdate()
      }
    } catch (error) {
      logger.error("Error updating post-graduate data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAcademicProgram = () => {
    if (isViewOnly) return
    setEditingAcademicProgram(null)
    setIsModalOpen(true)
  }

  const handleEditAcademicProgram = (program: DetailedCoursedProgramResponse) => {
    if (isViewOnly) return
    setEditingAcademicProgram(program)
    setIsModalOpen(true)
  }

  const handleCloseAcademicModal = () => {
    setIsModalOpen(false)
    setEditingAcademicProgram(null)
  }

  const handleEditPostGraduate = (item: DetailedAcademicEducationResponse) => {
    if (isViewOnly) return
    setEditingPostGraduate(item)
    setIsPostGraduateModalOpen(true)
  }

  const handleAddPostGraduate = () => {
    if (isViewOnly) return
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
      <TabContainer title="Información Académica">
        <EmptyStateCard
          icon={GraduationCap}
          title="Información Académica"
          description="No hay información académica disponible."
          actionText="Agregar Carrera Cursada"
          onAction={isViewOnly ? undefined : handleAddAcademicProgram}
          color="blue"
        />
      </TabContainer>
    )
  }

  return (
    <TabContainer 
      title="Información Académica"
      onAdd={handleAddAcademicProgram}
      showEditButton={false}
      showAddButton={!isViewOnly}
      addButtonText="Agregar Carrera Cursada"
      isLoading={isLoading}
    >
      {/* Academic Programs Section */}
      <TabSection title="" showEditButton={false}>
        {academicData.length === 0 ? (
          <EmptyStateCard
            icon={GraduationCap}
            title="Carreras Cursadas"
            description="No hay información académica registrada."
            actionText="Agregar Carrera Cursada"
            onAction={isViewOnly ? undefined : handleAddAcademicProgram}
            color="blue"
          />
        ) : (
          <div className="space-y-6">
            {academicData.map((academic, index) => (
              <AcademicProgramCard
                key={index}
                program={academic}
                index={index}
                getProgramName={getProgramName}
                onEdit={() => handleEditAcademicProgram(academic)}
                isViewOnly={isViewOnly}
              />
            ))}
          </div>
        )}
      </TabSection>

      {/* Post Graduate Section */}
      <TabSection 
        title="Estudios Post Graduación"
        onAdd={handleAddPostGraduate}
        showEditButton={false}
        showAddButton={!isViewOnly}
      >
        {Array.isArray(postGraduateData) && postGraduateData.length > 0 ? (
          <div className="space-y-4">
            {postGraduateData.map((postGrad, index) => (
              <PostGraduateCard
                key={index}
                postGraduate={postGrad}
                index={index}
                onEdit={handleEditPostGraduate}
                isViewOnly={isViewOnly}
              />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            icon={BookOpen}
            title="Estudios Post Graduación"
            description="No hay estudios post graduación registrados."
            actionText="Agregar Estudio Post Graduación"
            onAction={isViewOnly ? undefined : handleAddPostGraduate}
            color="purple"
          />
        )}
      </TabSection>

      <AcademicInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseAcademicModal}
        onSave={handleSave}
        academicData={academicData}
        postGraduateData={postGraduateData}
        editingProgram={editingAcademicProgram}
        userId={userId}
      />

      <PostGraduateModal
        isOpen={isPostGraduateModalOpen}
        onClose={handleClosePostGraduateModal}
        onSave={handlePostGraduateSave}
        postGraduateData={postGraduateData}
        editingItem={editingPostGraduate}
        userId={userId}
      />
    </TabContainer>
  )
}
