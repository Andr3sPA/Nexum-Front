"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import { SectionTitle } from "@/components/atoms/section-title"
import { AddButton } from "@/components/atoms/add-button"
import { WorkCurrentJobModal } from "@/components/organisms/modals/work-current-job-modal"
import { WorkFirstJobModal } from "@/components/organisms/modals/work-first-job-modal"
import { WorkQuestionsModal } from "@/components/organisms/modals/work-questions-modal"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { JobService, JobRequest, JobResponse } from "@/lib/services/profile/job.service"
import { useSearchJobParameters } from "@/hooks/use-search-job-parameters"
import { logger } from "@/lib/logging"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { AlertCircle } from "lucide-react"

interface WorkInfoTabProps {
  userProfile?: any;
}

export default function WorkInfoTab({ userProfile }: WorkInfoTabProps) {
  const [isCurrentJobModalOpen, setIsCurrentJobModalOpen] = useState(false)
  const [isFirstJobModalOpen, setIsFirstJobModalOpen] = useState(false)
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Get catalog data
  const {
    salaryRanges,
    jobDelays,
    jobAreas,
    institutionTypes,
    isLoading: isLoadingCatalog,
    error: catalogError,
    loadProgramSpecificData
  } = useSearchJobParameters()

  // Get user from localStorage
  const user = useMemo(() => {
    try {
      return LocalStorageService.getItem<any>("user")
    } catch (error) {
      console.error("Error getting user from localStorage:", error)
      return null
    }
  }, [])

  // Get user profile from localStorage
  const userProfileData = useMemo(() => {
    try {
      return LocalStorageService.getItem<any>("userProfile")
    } catch (error) {
      console.error("Error getting userProfile from localStorage:", error)
      return null
    }
  }, [])

  // Check if user has academic information
  const hasAcademicInfo = useMemo(() => {
    return userProfileData?.coursedPrograms && userProfileData.coursedPrograms.length > 0
  }, [userProfileData])

  // Get program ID for catalog data
  const programId = useMemo(() => {
    if (userProfileData?.coursedPrograms && userProfileData.coursedPrograms.length > 0) {
      const firstProgram = userProfileData.coursedPrograms[0]
      console.log("WorkInfoTab - First program:", firstProgram)
      console.log("WorkInfoTab - First program programVersion:", firstProgram.programVersion)
      
      // Try different possible paths to find the program ID
      const programId = firstProgram.programVersion?.program?.id || 
                       firstProgram.programVersion?.id ||
                       firstProgram.id
      
      console.log("WorkInfoTab - Trying to find program ID:", {
        'programVersion.program.id': firstProgram.programVersion?.program?.id,
        'programVersion.id': firstProgram.programVersion?.id,
        'firstProgram.id': firstProgram.id,
        'final programId': programId
      })
      
      return programId
    }
    console.log("WorkInfoTab - No program ID found in userProfileData")
    return null
  }, [userProfileData])

  // Fetch jobs data
  const fetchJobs = useCallback(async () => {
    if (!userProfileData?.id || hasInitialized) return

    try {
      setIsLoading(true)
      setError(null)

      const jobsData = await JobService.getByUserId(userProfileData.id)
      setJobs(jobsData)
      setHasInitialized(true)
    } catch (error) {
      console.error("Error loading jobs:", error)
      setError("Error al cargar la información laboral")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, hasInitialized])

  // Fetch data only once on mount
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Load program-specific catalog data when program ID is available
  useEffect(() => {
    console.log("WorkInfoTab useEffect - programId:", programId)
    if (programId) {
      console.log("Calling loadProgramSpecificData with programId:", programId)
      loadProgramSpecificData(programId)
    }
  }, [programId, loadProgramSpecificData])

  // Get current and first job
  const currentJob = useMemo(() => jobs.find(job => job.currentJob), [jobs])
  const firstJob = useMemo(() => jobs.find(job => job.firstJob), [jobs])

  // Debug log for modal data
  console.log("Modal data - jobAreas:", jobAreas, "institutionTypes:", institutionTypes, "hasAcademicInfo:", hasAcademicInfo)

  // Current job handlers
  const handleCurrentJobSave = useCallback(async (formData: any) => {
    if (!userProfileData?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const jobRequest: JobRequest = {
        userId: userProfileData.id,
        companyName: formData.companyName,
        country: formData.country,
        position: formData.position,
        relatedToProgram: formData.relatedToCareer === "si",
        salaryRangeId: parseInt(formData.salaryRangeId),
        jobDelayId: parseInt(formData.jobDelayId),
        jobAreaId: parseInt(formData.jobAreaId),
        institutionTypeId: parseInt(formData.institutionTypeId),
        firstJob: formData.alsoFirstJob,
        currentJob: true
      }

      let savedJob: JobResponse

      if (currentJob) {
        // Update existing current job
        savedJob = await JobService.updateById(currentJob.id, jobRequest)
      } else {
        // Create new current job
        savedJob = await JobService.create(jobRequest)
      }

      // Update jobs list
      setJobs(prev => {
        const filtered = prev.filter(job => !job.currentJob)
        return [...filtered, savedJob]
      })

      setIsCurrentJobModalOpen(false)
      logger.info("Current job saved successfully")
    } catch (error) {
      console.error("Error saving current job:", error)
      setError("Error al guardar el trabajo actual")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, currentJob])

  // First job handlers
  const handleFirstJobSave = useCallback(async (formData: any) => {
    if (!userProfileData?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const jobRequest: JobRequest = {
        userId: userProfileData.id,
        companyName: formData.companyName,
        country: formData.country,
        position: formData.position,
        relatedToProgram: formData.relatedToCareer === "si",
        salaryRangeId: parseInt(formData.salaryRangeId),
        jobDelayId: parseInt(formData.jobDelayId),
        jobAreaId: parseInt(formData.jobAreaId),
        institutionTypeId: parseInt(formData.institutionTypeId),
        firstJob: true,
        currentJob: formData.alsoCurrentJob
      }

      let savedJob: JobResponse

      if (firstJob) {
        // Update existing first job
        savedJob = await JobService.updateById(firstJob.id, jobRequest)
      } else {
        // Create new first job
        savedJob = await JobService.create(jobRequest)
      }

      // Update jobs list
      setJobs(prev => {
        const filtered = prev.filter(job => !job.firstJob)
        return [...filtered, savedJob]
      })

      setIsFirstJobModalOpen(false)
      logger.info("First job saved successfully")
    } catch (error) {
      console.error("Error saving first job:", error)
      setError("Error al guardar el primer trabajo")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, firstJob])

  if (isLoading && !hasInitialized) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando información laboral...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg mb-2">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null)
              setHasInitialized(false)
              fetchJobs()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Academic Information Warning */}
      {!hasAcademicInfo && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para mostrar información laboral específica de tu carrera, necesitas registrar tu información académica en la pestaña "Información Académica".
          </AlertDescription>
        </Alert>
      )}

      {/* Current Job Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SectionTitle>Trabajo Actual</SectionTitle>
          <EditButton onClick={() => setIsCurrentJobModalOpen(true)} />
        </div>
        
        {currentJob ? (
          <DataSection title="Información del Trabajo Actual">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Empresa" value={currentJob.companyName} />
              <DataField label="Cargo" value={currentJob.position} />
              <DataField label="País" value={currentJob.country} />
              <DataField label="Relacionado con la carrera" value={currentJob.relatedToProgram ? "Sí" : "No"} />
              <DataField label="Rango salarial" value={currentJob.salaryRange?.salary} />
              <DataField label="Tiempo en la empresa" value={currentJob.jobDelay?.label} />
              <DataField label="Área" value={currentJob.jobArea?.name} />
              <DataField label="Tipo de empresa" value={currentJob.institutionType?.name} />
            </div>
          </DataSection>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No hay información del trabajo actual</p>
          </div>
        )}
      </div>

      {/* First Job Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SectionTitle>Primer Trabajo</SectionTitle>
          <EditButton onClick={() => setIsFirstJobModalOpen(true)} />
        </div>
        
        {firstJob ? (
          <DataSection title="Información del Primer Trabajo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Empresa" value={firstJob.companyName} />
              <DataField label="Cargo" value={firstJob.position} />
              <DataField label="País" value={firstJob.country} />
              <DataField label="Relacionado con la carrera" value={firstJob.relatedToProgram ? "Sí" : "No"} />
              <DataField label="Rango salarial" value={firstJob.salaryRange?.salary} />
              <DataField label="Tiempo para conseguir trabajo" value={firstJob.jobDelay?.label} />
              <DataField label="Área" value={firstJob.jobArea?.name} />
              <DataField label="Tipo de empresa" value={firstJob.institutionType?.name} />
            </div>
          </DataSection>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No hay información del primer trabajo</p>
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SectionTitle>Preguntas Laborales</SectionTitle>
          <AddButton onClick={() => setIsQuestionsModalOpen(true)} />
        </div>
        
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No hay preguntas laborales registradas</p>
        </div>
      </div>

      {/* Modals */}
      <WorkCurrentJobModal
        isOpen={isCurrentJobModalOpen}
        onClose={() => setIsCurrentJobModalOpen(false)}
        onSave={handleCurrentJobSave}
        initialData={currentJob ? {
          companyName: currentJob.companyName,
          country: currentJob.country,
          position: currentJob.position,
          relatedToCareer: currentJob.relatedToProgram ? "si" : "no",
          salaryRangeId: currentJob.salaryRange?.id?.toString() || "",
          jobDelayId: currentJob.jobDelay?.id?.toString() || "",
          jobAreaId: currentJob.jobArea?.id?.toString() || "",
          institutionTypeId: currentJob.institutionType?.id?.toString() || "",
          alsoFirstJob: currentJob.firstJob
        } : {
          companyName: "",
          country: "",
          position: "",
          relatedToCareer: "",
          salaryRangeId: "",
          jobDelayId: "",
          jobAreaId: "",
          institutionTypeId: "",
          alsoFirstJob: false
        }}
        salaryRanges={salaryRanges}
        jobDelays={jobDelays}
        jobAreas={jobAreas}
        institutionTypes={institutionTypes}
        hasAcademicInfo={hasAcademicInfo}
        hasFirstJob={!!firstJob}
      />

      <WorkFirstJobModal
        isOpen={isFirstJobModalOpen}
        onClose={() => setIsFirstJobModalOpen(false)}
        onSave={handleFirstJobSave}
        initialData={firstJob ? {
          companyName: firstJob.companyName,
          country: firstJob.country,
          position: firstJob.position,
          relatedToCareer: firstJob.relatedToProgram ? "si" : "no",
          salaryRangeId: firstJob.salaryRange?.id?.toString() || "",
          jobDelayId: firstJob.jobDelay?.id?.toString() || "",
          jobAreaId: firstJob.jobArea?.id?.toString() || "",
          institutionTypeId: firstJob.institutionType?.id?.toString() || "",
          alsoCurrentJob: firstJob.currentJob
        } : {
          companyName: "",
          country: "",
          position: "",
          relatedToCareer: "",
          salaryRangeId: "",
          jobDelayId: "",
          jobAreaId: "",
          institutionTypeId: "",
          alsoCurrentJob: false
        }}
        salaryRanges={salaryRanges}
        jobDelays={jobDelays}
        jobAreas={jobAreas}
        institutionTypes={institutionTypes}
        hasAcademicInfo={hasAcademicInfo}
        hasCurrentJob={!!currentJob}
      />

      <WorkQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        onSave={() => {}}
        initialData={{
          profiles: "",
          formationRating: "",
          competencies: [],
          question1: "",
          question2: "",
          question3: ""
        }}
      />
    </div>
  )
}