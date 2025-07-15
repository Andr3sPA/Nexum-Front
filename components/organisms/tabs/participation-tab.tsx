"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TabContainer, TabSection, TabDataField } from "@/components/organisms/tab-container"
import ParticipationModal from "@/components/organisms/modals/participation-modal"
import InnovationProcessModal from "@/components/organisms/modals/innovation-process-modal"
import { EmptyStateCard } from "@/components/atoms/empty-state-card"
import { Card, CardHeader, CardContent } from "@/components/molecules/card"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { GraduateParticipationService, GraduateParticipationRequest, GraduateParticipationResponse } from "@/lib/services/profile/graduate-participation.service"
import { InnovationProcessService, InnovationProcessRequest, InnovationProcessResponse } from "@/lib/services/profile/innovation-process.service"
import { DetailedUserResponse, DetailedGraduateParticipationResponse, DetailedInnovationProcessResponse } from "@/lib/services/profile/detailed-user.service"
import { useInnovationTypes } from "@/contexts/innovation-types-context"
import { logger } from "@/lib/logging"
import { Users, BookOpen, Lightbulb, Plus, Edit, Trash2, ExternalLink, Calendar, Tag } from "lucide-react"

interface ParticipationTabProps {
  userProfile?: DetailedUserResponse;
}

export default function ParticipationTab({ userProfile }: ParticipationTabProps) {
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false)
  const [isInnovationModalOpen, setIsInnovationModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [participationInfo, setParticipationInfo] = useState<DetailedGraduateParticipationResponse | null>(null)
  const [selectedInnovationProcess, setSelectedInnovationProcess] = useState<InnovationProcessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Get innovation types from context
  const { innovationTypes } = useInnovationTypes()

  // Get user profile from localStorage
  const userProfileData = useMemo(() => {
    try {
      return LocalStorageService.getItem<any>("userProfile")
    } catch (error) {
      console.error("Error getting userProfile from localStorage:", error)
      return null
    }
  }, [])

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
      console.error("Error loading participation information:", error)
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
      
      // Update localStorage userProfile with new participation information
      const updatedUserProfile = {
        ...userProfileData,
        graduateParticipation: detailedParticipationInfo
      }
      LocalStorageService.setItem("userProfile", updatedUserProfile)
      
      setIsParticipationModalOpen(false)
      
      logger.info("Participation information saved successfully")
    } catch (error) {
      console.error("Error saving participation information:", error)
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
      LocalStorageService.setItem("userProfile", updatedUserProfile)

      setIsInnovationModalOpen(false)
      setSelectedInnovationProcess(null)
      
      logger.info("Innovation process saved successfully")
    } catch (error) {
      console.error("Error saving innovation process:", error)
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
      console.error("Error deleting innovation process:", error)
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
      <TabSection title="Información de Participación" onEdit={handleEditParticipation}>
        {participationInfo ? (
          <div className="space-y-6">
          <TabDataField 
              label="Intereses de Formación Continua"
              value={participationInfo.continuousEducationInterests?.length > 0 
                ? participationInfo.continuousEducationInterests.join(", ")
                : "No especificado"
              }
            />
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Disposición para Participar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "willingToBeSpeaker", label: "Conferencista" },
                  { key: "willingToBeProfessor", label: "Profesor" },
                  { key: "willingToTeachNonFormalEducation", label: "Profesor no formal" },
                  { key: "willingToBePostgraduateStudent", label: "Estudiante posgrado" },
                  { key: "willingToBeNonFormalStudent", label: "Estudiante no formal" },
                  { key: "willingToBeGraduateRepresentative", label: "Representante egresados" },
                  { key: "willingToAttendAlumniMeetings", label: "Encuentros egresados" },
                  { key: "willingToParticipateInAlumniActivities", label: "Actividades egresados" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      participationInfo[key as keyof DetailedGraduateParticipationResponse] 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {participationInfo[key as keyof DetailedGraduateParticipationResponse] ? "Sí" : "No"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Users}
            title="Información de Participación"
            description="No hay información de participación registrada"
            actionText="Añadir Información de Participación"
            onAction={handleEditParticipation}
            color="blue"
          />
        )}
      </TabSection>

      {/* Innovation Processes Section */}
      <TabSection title="Procesos de Innovación" onAdd={handleAddInnovationProcess} showAddButton={true}>
        {userProfileData?.innovationProcesses && userProfileData.innovationProcesses.length > 0 ? (
          <div className="space-y-4">
            {userProfileData.innovationProcesses.map((process: any) => (
              <Card key={process.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{process.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{process.type.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(process.creationDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditInnovationProcess(process)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInnovationProcess(process.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {process.description && (
                    <p className="text-gray-700 mb-3">{process.description}</p>
                  )}
                  {process.link && (
                    <a 
                      href={process.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver enlace del proyecto</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyStateCard
            icon={Lightbulb}
            title="Procesos de Innovación"
            description="No hay procesos de innovación registrados"
            actionText="Agregar Proceso de Innovación"
            onAction={handleAddInnovationProcess}
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