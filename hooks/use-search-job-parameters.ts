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

interface UseSearchJobParametersReturn {
  salaryRanges: SalaryRangeResponse[]
  jobDelays: JobDelayResponse[]
  jobAreas: JobAreaResponse[]
  institutionTypes: JobInstitutionTypeResponse[]
  isLoading: boolean
  error: string | null
  loadProgramSpecificData: (programId: number) => Promise<void>
  loadGeneralData: () => Promise<void>
}

export function useSearchJobParameters(): UseSearchJobParametersReturn {
  const [salaryRanges, setSalaryRanges] = useState<SalaryRangeResponse[]>([])
  const [jobDelays, setJobDelays] = useState<JobDelayResponse[]>([])
  const [jobAreas, setJobAreas] = useState<JobAreaResponse[]>([])
  const [institutionTypes, setInstitutionTypes] = useState<JobInstitutionTypeResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      console.log("Loading program-specific data for programId:", programId)

      // Load program-specific job areas and institution types
      const [jobAreasData, institutionTypesData] = await Promise.all([
        JobAreaService.getAllByProgramId(programId),
        JobInstitutionTypeService.getAllByProgramId(programId)
      ])

      console.log("Job areas loaded:", jobAreasData)
      console.log("Institution types loaded:", institutionTypesData)

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
    // Get user profile from localStorage inside useEffect to avoid infinite loops
    const userProfile = LocalStorageService.getItem<any>("userProfile")
    
    console.log("useEffect triggered - userProfile:", userProfile)
    if (userProfile?.coursedPrograms && userProfile.coursedPrograms.length > 0) {
      const firstProgram = userProfile.coursedPrograms[0]
      console.log("First program:", firstProgram)
      console.log("First program programVersion:", firstProgram.programVersion)
      
      // Try different possible paths to find the program ID
      const programId = firstProgram.programVersion?.program?.id || 
                       firstProgram.programVersion?.id ||
                       firstProgram.id
      
      console.log("Trying to find program ID:", {
        'programVersion.program.id': firstProgram.programVersion?.program?.id,
        'programVersion.id': firstProgram.programVersion?.id,
        'firstProgram.id': firstProgram.id,
        'final programId': programId
      })
      
      if (programId) {
        console.log("Loading data for program ID:", programId)
        loadProgramSpecificData(programId)
      } else {
        console.log("No program ID found in first program")
      }
    } else {
      console.log("No coursed programs found in userProfile")
    }
  }, [loadProgramSpecificData]) // Remove userProfile from dependencies

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