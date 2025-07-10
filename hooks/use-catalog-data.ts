"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  SalaryRangeService, 
  SalaryRangeResponse,
  JobDelayService, 
  JobDelayResponse,
  JobAreaService, 
  JobAreaResponse,
  JobInstitutionTypeService, 
  JobInstitutionTypeResponse
} from "@/lib/services/catalog"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { logger } from "@/lib/logging"

interface UseCatalogDataReturn {
  salaryRanges: SalaryRangeResponse[]
  jobDelays: JobDelayResponse[]
  jobAreas: JobAreaResponse[]
  institutionTypes: JobInstitutionTypeResponse[]
  isLoading: boolean
  error: string | null
  loadProgramSpecificData: (programId: number) => Promise<void>
  loadGeneralData: () => Promise<void>
}

export function useCatalogData(): UseCatalogDataReturn {
  const [salaryRanges, setSalaryRanges] = useState<SalaryRangeResponse[]>([])
  const [jobDelays, setJobDelays] = useState<JobDelayResponse[]>([])
  const [jobAreas, setJobAreas] = useState<JobAreaResponse[]>([])
  const [institutionTypes, setInstitutionTypes] = useState<JobInstitutionTypeResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user profile from localStorage
  const userProfile = LocalStorageService.getItem<any>("userProfile")

  const loadGeneralData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load salary ranges and job delays (these are general, not program-specific)
      const [salaryRangesData, jobDelaysData] = await Promise.all([
        SalaryRangeService.getAll(),
        JobDelayService.getAll()
      ])

      setSalaryRanges(salaryRangesData)
      setJobDelays(jobDelaysData)
    } catch (error) {
      console.error("Error loading general catalog data:", error)
      setError("Error al cargar datos del catálogo")
      logger.error("Error loading general catalog data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadProgramSpecificData = useCallback(async (programId: number) => {
    try {
      setIsLoading(true)
      setError(null)

      // Load program-specific job areas and institution types
      const [jobAreasData, institutionTypesData] = await Promise.all([
        JobAreaService.getAllByProgramId(programId),
        JobInstitutionTypeService.getAllByProgramId(programId)
      ])

      setJobAreas(jobAreasData)
      setInstitutionTypes(institutionTypesData)
    } catch (error) {
      console.error("Error loading program-specific catalog data:", error)
      setError("Error al cargar datos específicos del programa")
      logger.error("Error loading program-specific catalog data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-load general data on mount
  useEffect(() => {
    loadGeneralData()
  }, [loadGeneralData])

  // Auto-load program-specific data if user has a program
  useEffect(() => {
    if (userProfile?.coursedPrograms && userProfile.coursedPrograms.length > 0) {
      const firstProgram = userProfile.coursedPrograms[0]
      if (firstProgram?.programVersion?.program?.id) {
        loadProgramSpecificData(firstProgram.programVersion.program.id)
      }
    }
  }, [userProfile, loadProgramSpecificData])

  return {
    salaryRanges,
    jobDelays,
    jobAreas,
    institutionTypes,
    isLoading,
    error,
    loadProgramSpecificData,
    loadGeneralData
  }
} 