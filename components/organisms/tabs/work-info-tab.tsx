"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TabContainer, TabSection, TabDataField, TabEmptyState } from "@/components/organisms/tab-container"
import { WorkCurrentJobModal } from "@/components/organisms/modals/work-current-job-modal"
import { WorkFirstJobModal } from "@/components/organisms/modals/work-first-job-modal"
import { WorkQuestionsModal } from "@/components/organisms/modals/work-questions-modal"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { JobService, JobRequest, JobResponse } from "@/lib/services/profile/job.service"
import { useSearchJobParameters } from "@/hooks/use-search-job-parameters"
import { logger } from "@/lib/logging"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { InfoCard } from "@/components/atoms/info-card"
import { StatusBadge } from "@/components/atoms/status-badge"
import { JobHeader } from "@/components/atoms/job-header"
import { AlertCircle, Building2, Briefcase, MapPin, DollarSign, Clock, Users, Building } from "lucide-react"
import { DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { Card, CardHeader, CardContent } from "@/components/molecules/card"
import { ProgramVersionService } from "@/lib/services/catalog/program-version.service";

interface WorkInfoTabProps {
  userProfile?: DetailedUserResponse & { email?: string }
  isViewOnly?: boolean
  onDataUpdate?: () => Promise<void>
}

export default function WorkInfoTab({ userProfile, isViewOnly = false, onDataUpdate }: WorkInfoTabProps) {
  console.log("🏢 WorkInfoTab rendered with:", { userProfile: !!userProfile, isViewOnly, hasOnDataUpdate: !!onDataUpdate })
  
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

  // Check if user has academic information using the userProfile prop
  const hasAcademicInfo = useMemo(() => {
    return userProfile?.coursedPrograms && userProfile.coursedPrograms.length > 0
  }, [userProfile])

  // Get program ID for catalog data
  const [programId, setProgramId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProgramId() {
    if (userProfile?.coursedPrograms && userProfile.coursedPrograms.length > 0) {
        const firstProgram = userProfile.coursedPrograms[0];
        const programVersionId = firstProgram.programVersion?.id;
        if (programVersionId) {
          try {
            const version = await ProgramVersionService.getById(programVersionId);
            setProgramId(version.program.id);
          } catch (e) {
            console.error("No se pudo obtener la versión del programa para catálogo laboral", e);
            setProgramId(null);
          }
        } else {
          setProgramId(null);
        }
      } else {
        setProgramId(null);
      }
    }
    fetchProgramId();
  }, [userProfile]);

  // Fetch jobs data
  const fetchJobs = useCallback(async () => {
    if (!userProfile?.id || hasInitialized) return

    try {
      setIsLoading(true)
      setError(null)

      const jobsData = await JobService.getByUserId(userProfile.id)
      setJobs(jobsData)
      setHasInitialized(true)
    } catch (error) {
      console.error("Error loading jobs:", error)
      setError("Error al cargar la información laboral")
    } finally {
      setIsLoading(false)
    }
  }, [userProfile, hasInitialized])

  // Fetch data only once on mount
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Load program-specific catalog data when program ID is available
  useEffect(() => {
    if (programId) {
      loadProgramSpecificData(programId);
    }
  }, [programId, loadProgramSpecificData]);

  // Get current and first job
  const currentJob = useMemo(() => jobs.find(job => job.currentJob), [jobs])
  const firstJob = useMemo(() => jobs.find(job => job.firstJob), [jobs])

  // Debug log for modal data
  console.log("Modal data - jobAreas:", jobAreas, "institutionTypes:", institutionTypes, "hasAcademicInfo:", hasAcademicInfo)

  // Current job handlers
  const handleCurrentJobSave = useCallback(async (formData: any) => {
    console.log("🟢 WorkInfoTab - handleCurrentJobSave called with formData:", formData)
    if (!userProfile?.id) {
      console.error("🟠 WorkInfoTab - No userProfile.id found")
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const jobRequest: JobRequest = {
        userId: userProfile.id,
        companyName: formData.companyName,
        country: formData.country,
        position: formData.position,
        relatedToProgram: formData.relatedToProgram,
        salaryRangeId: formData.salaryRangeId,
        jobDelayId: formData.jobDelayId,
        jobAreaId: formData.jobAreaId,
        institutionTypeId: formData.institutionTypeId,
        firstJob: formData.alsoFirstJob,
        currentJob: true
      }

      console.log("🟢 WorkInfoTab - jobRequest:", jobRequest)

      let savedJob: JobResponse

      if (currentJob) {
        console.log("🟢 WorkInfoTab - Updating existing current job with ID:", currentJob.id)
        // Update existing current job
        savedJob = await JobService.updateById(currentJob.id, jobRequest)
      } else {
        console.log("🟢 WorkInfoTab - Creating new current job")
        // Create new current job
        savedJob = await JobService.create(jobRequest)
      }

      console.log("🟢 WorkInfoTab - savedJob:", savedJob)

      // Update jobs list
      setJobs(prev => {
        const filtered = prev.filter(job => !job.currentJob)
        return [...filtered, savedJob]
      })

      // Refresh profile data
      if (onDataUpdate) {
        await onDataUpdate()
      }

      setIsCurrentJobModalOpen(false)
      logger.info("Current job saved successfully")
    } catch (error) {
      console.error("🔴 WorkInfoTab - Error saving current job:", error)
      setError("Error al guardar el trabajo actual")
    } finally {
      setIsLoading(false)
    }
  }, [userProfile, currentJob, onDataUpdate])

  // First job handlers
  const handleFirstJobSave = useCallback(async (formData: any) => {
    console.log("🟡 WorkInfoTab - handleFirstJobSave called with formData:", formData)
    if (!userProfile?.id) {
      console.error("🟠 WorkInfoTab - No userProfile.id found")
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const jobRequest: JobRequest = {
        userId: userProfile.id,
        companyName: formData.companyName,
        country: formData.country,
        position: formData.position,
        relatedToProgram: formData.relatedToProgram,
        salaryRangeId: formData.salaryRangeId,
        jobDelayId: formData.jobDelayId,
        jobAreaId: formData.jobAreaId,
        institutionTypeId: formData.institutionTypeId,
        firstJob: true,
        currentJob: formData.alsoCurrentJob
      }

      console.log("🟡 WorkInfoTab - jobRequest:", jobRequest)

      let savedJob: JobResponse

      if (firstJob) {
        console.log("🟡 WorkInfoTab - Updating existing first job with ID:", firstJob.id)
        // Update existing first job
        savedJob = await JobService.updateById(firstJob.id, jobRequest)
      } else {
        console.log("🟡 WorkInfoTab - Creating new first job")
        // Create new first job
        savedJob = await JobService.create(jobRequest)
      }

      console.log("🟡 WorkInfoTab - savedJob:", savedJob)

      // Update jobs list
      setJobs(prev => {
        const filtered = prev.filter(job => !job.firstJob)
        return [...filtered, savedJob]
      })

      // Refresh profile data
      if (onDataUpdate) {
        await onDataUpdate()
      }

      setIsFirstJobModalOpen(false)
      logger.info("First job saved successfully")
    } catch (error) {
      console.error("🔴 WorkInfoTab - Error saving first job:", error)
      setError("Error al guardar el primer trabajo")
    } finally {
      setIsLoading(false)
    }
  }, [userProfile, firstJob, onDataUpdate])

  // Questions handlers
  const handleQuestionsSave = useCallback(async (formData: any) => {
    if (!userProfile?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // TODO: Implement questions save logic
      console.log("Questions form data:", formData)
      
      // Refresh profile data
      if (onDataUpdate) {
        await onDataUpdate()
      }
      
      setIsQuestionsModalOpen(false)
      logger.info("Questions saved successfully")
    } catch (error) {
      console.error("Error saving questions:", error)
      setError("Error al guardar las preguntas")
    } finally {
      setIsLoading(false)
    }
  }, [userProfile, onDataUpdate])

  const handleEditCurrentJob = () => {
    if (isViewOnly) return
    setIsCurrentJobModalOpen(true)
  }

  const handleEditFirstJob = () => {
    if (isViewOnly) return
    setIsFirstJobModalOpen(true)
  }

  const handleEditQuestions = () => {
    if (isViewOnly) return
    setIsQuestionsModalOpen(true)
  }

  const handleCloseCurrentJobModal = () => {
    setIsCurrentJobModalOpen(false)
  }

  const handleCloseFirstJobModal = () => {
    setIsFirstJobModalOpen(false)
  }

  const handleCloseQuestionsModal = () => {
    setIsQuestionsModalOpen(false)
  }

  // Show warning if no academic info
  if (!hasAcademicInfo) {
    return (
      <TabContainer title="Información Laboral">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para acceder a la información laboral, primero debe completar su información académica.
          </AlertDescription>
        </Alert>
      </TabContainer>
    )
  }

  return (
    <TabContainer 
      title="Información Laboral"
      isLoading={isLoading || isLoadingCatalog}
      error={error || catalogError}
    >
      {/* Current Job Section */}
      <TabSection 
        title="Trabajo Actual"
        onEdit={handleEditCurrentJob}
        showEditButton={!isViewOnly}
      >
        {currentJob ? (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-4">
              <JobHeader
                icon={Building2}
                companyName={currentJob.companyName}
                position={currentJob.position}
                color="green"
              />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={MapPin}
                  label="País"
                  value={currentJob.country}
                />
                
                <InfoCard
                  icon={DollarSign}
                  label="Rango Salarial"
                  value={currentJob.salaryRange?.salary || "No disponible"}
                />
                
                <InfoCard
                  icon={Clock}
                  label="Tiempo Promedio"
                  value={currentJob.jobDelay?.label || "No disponible"}
                />
                
                <InfoCard
                  icon={Users}
                  label="Área de Trabajo"
                  value={currentJob.jobArea?.name || "No disponible"}
                />
                
                <InfoCard
                  icon={Building}
                  label="Tipo de Institución"
                  value={currentJob.institutionType?.name || "No disponible"}
                />
                
                <InfoCard
                  icon={Briefcase}
                  label="Relacionado con el Programa"
                  value={<StatusBadge status={currentJob.relatedToProgram} />}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <TabEmptyState message="No hay información del trabajo actual registrada." />
        )}
      </TabSection>

      {/* First Job Section */}
      <TabSection 
        title="Primer Trabajo"
        onEdit={handleEditFirstJob}
        showEditButton={!isViewOnly}
      >
        {firstJob ? (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <JobHeader
                icon={Building2}
                companyName={firstJob.companyName}
                position={firstJob.position}
                color="blue"
              />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={MapPin}
                  label="País"
                  value={firstJob.country}
                />
                
                <InfoCard
                  icon={DollarSign}
                  label="Rango Salarial"
                  value={firstJob.salaryRange?.salary || "No disponible"}
                />
                
                <InfoCard
                  icon={Clock}
                  label="Tiempo Promedio"
                  value={firstJob.jobDelay?.label || "No disponible"}
                />
                
                <InfoCard
                  icon={Users}
                  label="Área de Trabajo"
                  value={firstJob.jobArea?.name || "No disponible"}
                />
                
                <InfoCard
                  icon={Building}
                  label="Tipo de Institución"
                  value={firstJob.institutionType?.name || "No disponible"}
                />
                
                <InfoCard
                  icon={Briefcase}
                  label="Relacionado con el Programa"
                  value={<StatusBadge status={firstJob.relatedToProgram} />}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <TabEmptyState message="No hay información del primer trabajo registrada." />
        )}
      </TabSection>

      {/* Questions Section */}
      <TabSection 
        title="Preguntas Adicionales"
        onEdit={handleEditQuestions}
        showEditButton={!isViewOnly}
      >
        <TabEmptyState message="No hay respuestas a preguntas adicionales registradas." />
      </TabSection>

      <WorkCurrentJobModal
        isOpen={isCurrentJobModalOpen}
        onClose={handleCloseCurrentJobModal}
        onSave={handleCurrentJobSave}
        initialData={currentJob ? {
          companyName: currentJob.companyName,
          country: currentJob.country,
          position: currentJob.position,
          relatedToProgram: currentJob.relatedToProgram,
          salaryRangeId: currentJob.salaryRange?.id || 0,
          jobDelayId: currentJob.jobDelay?.id || 0,
          jobAreaId: currentJob.jobArea?.id || 0,
          institutionTypeId: currentJob.institutionType?.id || 0,
          alsoFirstJob: currentJob.firstJob
        } : null}
        salaryRanges={salaryRanges}
        jobDelays={jobDelays}
        jobAreas={jobAreas}
        institutionTypes={institutionTypes}
      />

      <WorkFirstJobModal
        isOpen={isFirstJobModalOpen}
        onClose={handleCloseFirstJobModal}
        onSave={handleFirstJobSave}
        initialData={firstJob ? {
          companyName: firstJob.companyName,
          country: firstJob.country,
          position: firstJob.position,
          relatedToProgram: firstJob.relatedToProgram,
          salaryRangeId: firstJob.salaryRange?.id || 0,
          jobDelayId: firstJob.jobDelay?.id || 0,
          jobAreaId: firstJob.jobArea?.id || 0,
          institutionTypeId: firstJob.institutionType?.id || 0,
          alsoCurrentJob: firstJob.currentJob
        } : null}
        salaryRanges={salaryRanges}
        jobDelays={jobDelays}
        jobAreas={jobAreas}
        institutionTypes={institutionTypes}
      />

      <WorkQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={handleCloseQuestionsModal}
        onSave={handleQuestionsSave}
      />
    </TabContainer>
  )
}