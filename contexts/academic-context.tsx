"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { ProgramResponse } from "@/lib/services/catalog/program.service"
import { ProgramVersionResponse } from "@/lib/services/catalog/program-version.service"
import { ProgramService } from "@/lib/services/catalog/program.service"
import { ProgramVersionService } from "@/lib/services/catalog/program-version.service"
import { logger } from "@/lib/logging"
import { LocalStorageService } from "@/lib/services/local-storage.service"

interface AcademicContextType {
  programs: ProgramResponse[]
  programVersions: ProgramVersionResponse[]
  isLoadingPrograms: boolean
  isLoadingVersions: boolean
  loadProgramVersions: (programId: number) => Promise<void>
  clearProgramVersions: () => void
  loadPrograms: () => Promise<void>
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined)

interface AcademicProviderProps {
  children: ReactNode
}

export function AcademicProvider({ children }: AcademicProviderProps) {
  const [programs, setPrograms] = useState<ProgramResponse[]>([])
  const [programVersions, setProgramVersions] = useState<ProgramVersionResponse[]>([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)

  const loadPrograms = useCallback(async () => {
    // Check if user is authenticated
    const user = LocalStorageService.getItem<{ token?: string }>("user")
    if (!user?.token) {
      logger.info("User not authenticated, skipping program load")
      return
    }

    logger.info("Starting to load programs...")
    try {
      setIsLoadingPrograms(true)
      logger.info("Calling ProgramService.getAll()...")
      const programsData = await ProgramService.getAll()
      logger.info("Programs data received:", programsData)
      logger.info("Type of programsData:", typeof programsData)
      logger.info("Is array:", Array.isArray(programsData))
      logger.info("Length:", programsData?.length)
      setPrograms(Array.isArray(programsData) ? programsData : [])
      logger.info("Programs state set successfully")
    } catch (error) {
      logger.error("Error loading programs:", error)
      setPrograms([])
    } finally {
      setIsLoadingPrograms(false)
      logger.info("Loading programs finished")
    }
  }, [])

  // Load programs when user is authenticated
  useEffect(() => {
    const user = LocalStorageService.getItem<{ token?: string }>("user")
    if (user?.token) {
      loadPrograms()
    }
  }, [loadPrograms])

  const loadProgramVersions = useCallback(async (programId: number) => {
    if (!programId) {
      setProgramVersions([])
      return
    }
    
    try {
      setIsLoadingVersions(true)
      const versionsData = await ProgramVersionService.getAllByProgramId(programId)
      setProgramVersions(versionsData)
    } catch (error) {
      logger.error("Error loading program versions:", error)
      setProgramVersions([])
    } finally {
      setIsLoadingVersions(false)
    }
  }, [])

  const clearProgramVersions = useCallback(() => {
    setProgramVersions([])
  }, [])

  const value: AcademicContextType = {
    programs,
    programVersions,
    isLoadingPrograms,
    isLoadingVersions,
    loadProgramVersions,
    clearProgramVersions,
    loadPrograms,
  }

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  )
}

export function useAcademic() {
  const context = useContext(AcademicContext)
  if (context === undefined) {
    throw new Error("useAcademic must be used within an AcademicProvider")
  }
  return context
} 