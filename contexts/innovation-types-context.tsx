"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { InnovationProcessTypeService, InnovationProcessTypeResponse } from "@/lib/services/catalog/innovation-process-type.service"
import { logger } from "@/lib/logging"

interface InnovationTypesContextType {
  innovationTypes: InnovationProcessTypeResponse[]
  isLoading: boolean
  error: string | null
  refreshTypes: () => Promise<void>
}

const InnovationTypesContext = createContext<InnovationTypesContextType | undefined>(undefined)

interface InnovationTypesProviderProps {
  children: ReactNode
}

export function InnovationTypesProvider({ children }: InnovationTypesProviderProps) {
  const [innovationTypes, setInnovationTypes] = useState<InnovationProcessTypeResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchInnovationTypes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const types = await InnovationProcessTypeService.getAll()
      setInnovationTypes(types)
      setHasLoaded(true)
      
      logger.info("Innovation types loaded successfully")
    } catch (error) {
      console.error("Error loading innovation types:", error)
      setError("Error al cargar los tipos de innovación")
      setInnovationTypes([])
    } finally {
      setIsLoading(false)
    }
  }

  const refreshTypes = async () => {
    await fetchInnovationTypes()
  }

  useEffect(() => {
    if (!hasLoaded) {
      fetchInnovationTypes()
    }
  }, [hasLoaded])

  const value: InnovationTypesContextType = {
    innovationTypes,
    isLoading,
    error,
    refreshTypes,
  }

  return (
    <InnovationTypesContext.Provider value={value}>
      {children}
    </InnovationTypesContext.Provider>
  )
}

export function useInnovationTypes() {
  const context = useContext(InnovationTypesContext)
  if (context === undefined) {
    throw new Error("useInnovationTypes must be used within an InnovationTypesProvider")
  }
  return context
} 