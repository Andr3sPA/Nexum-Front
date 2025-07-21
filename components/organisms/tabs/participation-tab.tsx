"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TabContainer, TabSection } from "@/components/organisms/tab-container"
import ParticipationModal from "@/components/organisms/modals/participation-modal"
import InnovationProcessModal from "@/components/organisms/modals/innovation-process-modal"
import { EmptyStateCard } from "@/components/atoms/empty-state-card"
import { ParticipationInfoCard } from "@/components/molecules/participation-info-card"
import { InnovationProcessesCard } from "@/components/molecules/innovation-processes-card"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { GraduateParticipationService, GraduateParticipationRequest, GraduateParticipationResponse } from "@/lib/services/profile/graduate-participation.service"
import { InnovationProcessService, InnovationProcessRequest, InnovationProcessResponse } from "@/lib/services/profile/innovation-process.service"
import { DetailedUserResponse, DetailedGraduateParticipationResponse, DetailedInnovationProcessResponse } from "@/lib/services/profile/detailed-user.service"
import { useInnovationTypes } from "@/contexts/innovation-types-context"
import { logger } from "@/lib/logging"
import { Users, Lightbulb } from "lucide-react"

interface ParticipationTabProps {
  userProfile?: DetailedUserResponse;
  isViewOnly?: boolean;
  onDataUpdate?: () => Promise<void>;
}

export default function ParticipationTab({ userProfile, isViewOnly = false, onDataUpdate }: ParticipationTabProps) {
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false)
  const [isInnovationModalOpen, setIsInnovationModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [participationInfo, setParticipationInfo] = useState<DetailedGraduateParticipationResponse | null>(null)
  const [selectedInnovationProcess, setSelectedInnovationProcess] = useState<InnovationProcessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Get innovation types from context
  const { innovationTypes } = useInnovationTypes()

  // Use userProfile from props (backend data) or fallback to localStorage
  const userProfileData = useMemo(() => {
    // If userProfile is provided (from backend), use it
    if (userProfile) {
      return userProfile
    }
    // Otherwise, fallback to localStorage (for current user)
    try {
      return LocalStorageService.getItem<any>("userProfile")
    } catch (error) {
      logger.error("Error getting userProfile from localStorage:", error)
      return null
    }
  }, [userProfile])

  // Fetch participation data - memoized callback
  const fetchData = useCallback(async () => {
    if (!userProfileData?.id || hasInitialized) return

    try {
      setIsLoading(true)
      setError(null)

      // Get participation information from userProfile
      if (userProfileData.graduateParticipation) {
        setParticipationInfo(userProfileData.graduateParticipation)
      } else {
        setParticipationInfo(null)
      }

      setHasInitialized(true)
    } catch (error) {
      logger.error("Error loading participation information:", error)
      setError("Error al cargar la información de participación")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, hasInitialized])

  // Fetch data only once on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Participation handlers
  const handleParticipationSave = useCallback(async (formData: GraduateParticipationRequest) => {
    if (!userProfileData?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const participationRequest: GraduateParticipationRequest = {
        userId: userProfileData.id,
        continuousEducationInterests: formData.continuousEducationInterests,
        willingToBeSpeaker: formData.willingToBeSpeaker,
        willingToBeProfessor: formData.willingToBeProfessor,
        willingToTeachNonFormalEducation: formData.willingToTeachNonFormalEducation,
        willingToBePostgraduateStudent: formData.willingToBePostgraduateStudent,
        willingToBeNonFormalStudent: formData.willingToBeNonFormalStudent,
        willingToBeGraduateRepresentative: formData.willingToBeGraduateRepresentative,
        willingToAttendAlumniMeetings: formData.willingToAttendAlumniMeetings,
        willingToParticipateInAlumniActivities: formData.willingToParticipateInAlumniActivities,
      }

      let savedParticipationInfo: GraduateParticipationResponse

      if (participationInfo) {
        // Update existing participation information
        savedParticipationInfo = await GraduateParticipationService.updateById(participationInfo.id, participationRequest)
      } else {
        // Create new participation information
        savedParticipationInfo = await GraduateParticipationService.create(participationRequest)
      }

      // Convert to DetailedGraduateParticipationResponse format
      const detailedParticipationInfo: DetailedGraduateParticipationResponse = {
        id: savedParticipationInfo.id,
        continuousEducationInterests: savedParticipationInfo.continuousEducationInterests,
        willingToBeSpeaker: savedParticipationInfo.willingToBeSpeaker,
        willingToBeProfessor: savedParticipationInfo.willingToBeProfessor,
        willingToTeachNonFormalEducation: savedParticipationInfo.willingToTeachNonFormalEducation,
        willingToBePostgraduateStudent: savedParticipationInfo.willingToBePostgraduateStudent,
        willingToBeNonFormalStudent: savedParticipationInfo.willingToBeNonFormalStudent,
        willingToBeGraduateRepresentative: savedParticipationInfo.willingToBeGraduateRepresentative,
        willingToAttendAlumniMeetings: savedParticipationInfo.willingToAttendAlumniMeetings,
        willingToParticipateInAlumniActivities: savedParticipationInfo.willingToParticipateInAlumniActivities,
      }

      setParticipationInfo(detailedParticipationInfo)
      
      // Update localStorage userProfile with new participation information (only for current user)
      if (!userProfile) { // Only update localStorage if we're viewing our own profile
        const updatedUserProfile = {
          ...userProfileData,
          graduateParticipation: detailedParticipationInfo
        }
        LocalStorageService.setItem("userProfile", updatedUserProfile)
      }
      
      // Call onDataUpdate to refresh the parent component
      if (onDataUpdate) {
        await onDataUpdate()
      }
      
      setIsParticipationModalOpen(false)
      
      logger.info("Participation information saved successfully")
    } catch (error) {
      logger.error("Error saving participation information:", error)
      setError("Error al guardar la información de participación")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, participationInfo])

  // Innovation process handlers
  const handleInnovationSave = useCallback(async (formData: InnovationProcessRequest) => {
    if (!userProfileData?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const innovationRequest: InnovationProcessRequest = {
        userId: userProfileData.id,
        typeId: formData.typeId,
        name: formData.name,
        description: formData.description,
        link: formData.link,
      }

      let savedInnovationProcess: InnovationProcessResponse

      if (selectedInnovationProcess) {
        // Update existing innovation process
        savedInnovationProcess = await InnovationProcessService.updateById(selectedInnovationProcess.id, innovationRequest)
      } else {
        // Create new innovation process
        savedInnovationProcess = await InnovationProcessService.create(innovationRequest)
      }

      // Convert to DetailedInnovationProcessResponse format
      const detailedInnovationProcess: DetailedInnovationProcessResponse = {
        id: savedInnovationProcess.id,
        type: {
          id: savedInnovationProcess.type.id,
          name: savedInnovationProcess.type.name,
          description: savedInnovationProcess.type.description
        },
        name: savedInnovationProcess.name,
        description: savedInnovationProcess.description,
        link: savedInnovationProcess.link,
        creationDate: savedInnovationProcess.creationDate,
        lastUpdate: savedInnovationProcess.lastUpdate,
      }

      // Update localStorage userProfile with new innovation process
      const currentInnovationProcesses = userProfileData.innovationProcesses || []
      let updatedInnovationProcesses: DetailedInnovationProcessResponse[]

      if (selectedInnovationProcess) {
        // Update existing process
        updatedInnovationProcesses = currentInnovationProcesses.map((process: any) => 
          process.id === selectedInnovationProcess.id ? detailedInnovationProcess : process
        )
      } else {
        // Add new process
        updatedInnovationProcesses = [...currentInnovationProcesses, detailedInnovationProcess]
      }

      const updatedUserProfile = {
        ...userProfileData,
        innovationProcesses: updatedInnovationProcesses
      }
      
      // Update localStorage userProfile with new innovation process (only for current user)
      if (!userProfile) { // Only update localStorage if we're viewing our own profile
        LocalStorageService.setItem("userProfile", updatedUserProfile)
      }
      
      // Call onDataUpdate to refresh the parent component
      if (onDataUpdate) {
        await onDataUpdate()
      }

      setIsInnovationModalOpen(false)
      setSelectedInnovationProcess(null)
      
      logger.info("Innovation process saved successfully")
    } catch (error) {
      logger.error("Error saving innovation process:", error)
      setError("Error al guardar el proceso de innovación")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, selectedInnovationProcess])

  const handleDeleteInnovationProcess = useCallback(async (processId: number) => {
    if (!confirm("¿Está seguro de que desea eliminar este proceso de innovación?")) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await InnovationProcessService.deleteById(processId)
      
      // Update localStorage userProfile by removing the deleted process
      const currentInnovationProcesses = userProfileData?.innovationProcesses || []
      const updatedInnovationProcesses = currentInnovationProcesses.filter((process: any) => process.id !== processId)
      
      const updatedUserProfile = {
        ...userProfileData,
        innovationProcesses: updatedInnovationProcesses
      }
      LocalStorageService.setItem("userProfile", updatedUserProfile)
      
      logger.info("Innovation process deleted successfully")
    } catch (error) {
      logger.error("Error deleting innovation process:", error)
      setError("Error al eliminar el proceso de innovación")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData])

  const handleEditParticipation = () => {
    setIsParticipationModalOpen(true)
  }

  const handleCloseParticipationModal = () => {
    setIsParticipationModalOpen(false)
  }

  const handleAddInnovationProcess = () => {
    setSelectedInnovationProcess(null)
    setIsInnovationModalOpen(true)
  }

  const handleEditInnovationProcess = (process: DetailedInnovationProcessResponse) => {
    // Convert DetailedInnovationProcessResponse to InnovationProcessResponse for the modal
    const innovationProcess: InnovationProcessResponse = {
      id: process.id,
      user: { id: userProfileData?.id || "", name: "", lastName: "" },
      type: {
        id: process.type.id,
        name: process.type.name,
        description: process.type.description || ""
      },
      name: process.name,
      description: process.description,
      link: process.link,
      creationDate: process.creationDate,
      lastUpdate: process.lastUpdate,
    }
    setSelectedInnovationProcess(innovationProcess)
    setIsInnovationModalOpen(true)
  }

  const handleCloseInnovationModal = () => {
    setIsInnovationModalOpen(false)
    setSelectedInnovationProcess(null)
  }

  return (
    <TabContainer 
      title="Participación"
      isLoading={isLoading}
      error={error}
    >
      {/* Participation Information Section */}
      <TabSection title="" showEditButton={false}>
        {participationInfo ? (
          <ParticipationInfoCard 
            participationInfo={participationInfo} 
            onEdit={isViewOnly ? undefined : handleEditParticipation} 
          />
        ) : (
          <EmptyStateCard
            icon={Users}
            title="Información de Participación"
            description="No hay información de participación registrada"
            actionText={isViewOnly ? undefined : "Añadir Información de Participación"}
            onAction={isViewOnly ? undefined : handleEditParticipation}
            color="blue"
          />
        )}
      </TabSection>

      {/* Innovation Processes Section */}
      <TabSection title="" showEditButton={false}>
        {userProfileData?.innovationProcesses && userProfileData.innovationProcesses.length > 0 ? (
          <InnovationProcessesCard
            innovationProcesses={userProfileData.innovationProcesses}
            onAdd={isViewOnly ? undefined : handleAddInnovationProcess}
            onEdit={isViewOnly ? undefined : handleEditInnovationProcess}
            onDelete={isViewOnly ? undefined : handleDeleteInnovationProcess}
          />
        ) : (
          <EmptyStateCard
            icon={Lightbulb}
            title="Procesos de Innovación"
            description="No hay procesos de innovación registrados"
            actionText={isViewOnly ? undefined : "Agregar Proceso de Innovación"}
            onAction={isViewOnly ? undefined : handleAddInnovationProcess}
            color="purple"
          />
        )}
      </TabSection>

      <ParticipationModal
        isOpen={isParticipationModalOpen}
        onClose={handleCloseParticipationModal}
        onSave={handleParticipationSave}
        initialData={participationInfo || undefined}
      />

      <InnovationProcessModal
        isOpen={isInnovationModalOpen}
        onClose={handleCloseInnovationModal}
        onSave={handleInnovationSave}
        initialData={selectedInnovationProcess || undefined}
        innovationTypes={innovationTypes}
      />
    </TabContainer>
  )
}