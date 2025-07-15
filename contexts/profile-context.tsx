"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { logger } from "@/lib/logging"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { CoursedProgramService } from "@/lib/services/profile/coursed-program.service"
import { AcademicEducationService } from "@/lib/services/profile/academic-education.service"
import { ContactInformationService } from "@/lib/services/profile/contact-information.service"
import { FamilyInformationService } from "@/lib/services/profile/family-information.service"
import { ProgramVersionService } from "@/lib/services/catalog/program-version.service"
import { DetailedCoursedProgramResponse, DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { ContactInformationResponse } from "@/lib/services/profile/contact-information.service"
import { FamilyInformationResponse } from "@/lib/services/profile/family-information.service"

interface ProfileContextType {
  // Academic methods
  createCoursedProgram: (data: {
    userId: string
    programVersionId: number
    graduationYear: number
    strengths: string[]
    weaknesses: string[]
    improvementSuggestions: string[]
  }) => Promise<void>
  updateCoursedProgram: (id: number, data: {
    userId: string
    programVersionId: number
    graduationYear: number
    strengths: string[]
    weaknesses: string[]
    improvementSuggestions: string[]
  }) => Promise<void>
  getProgramVersionInfo: (programVersionId: number) => Promise<any>
  
  // Post-graduate methods
  createAcademicEducation: (data: {
    userId: string
    type: "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER"
    studyName: string
    institution: string
    country: string
  }) => Promise<void>
  updateAcademicEducation: (id: number, data: {
    userId: string
    type: "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER"
    studyName: string
    institution: string
    country: string
  }) => Promise<void>
  
  // Contact information methods
  createContactInformation: (data: {
    userId: string
    address: string
    country: string
    state: string
    city: string
    landline: string
    mobile: string
    email: string
    academicEmail: string
    whatsappAuthorization: boolean
  }) => Promise<void>
  updateContactInformation: (id: number, data: {
    userId: string
    address: string
    country: string
    state: string
    city: string
    landline: string
    mobile: string
    email: string
    academicEmail: string
    whatsappAuthorization: boolean
  }) => Promise<void>
  
  // Family information methods
  createFamilyInformation: (data: {
    userId: string
    maritalState: string
    childNumber: number
  }) => Promise<void>
  updateFamilyInformation: (id: number, data: {
    userId: string
    maritalState: string
    childNumber: number
  }) => Promise<void>
  
  // Utility methods
  getUserId: () => string | null
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
  children: ReactNode
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const getUserId = useCallback(() => {
    const user = LocalStorageService.getItem<{ id: string }>("user")
    const userProfile = LocalStorageService.getItem<{ id: string }>("userProfile")
    return userProfile?.id || user?.id || null
  }, [])

  const createCoursedProgram = useCallback(async (data: {
    userId: string
    programVersionId: number
    graduationYear: number
    strengths: string[]
    weaknesses: string[]
    improvementSuggestions: string[]
  }) => {
    try {
      await CoursedProgramService.create(data)
    } catch (error) {
      logger.error("Error creating coursed program:", error)
      throw error
    }
  }, [])

  const updateCoursedProgram = useCallback(async (id: number, data: {
    userId: string
    programVersionId: number
    graduationYear: number
    strengths: string[]
    weaknesses: string[]
    improvementSuggestions: string[]
  }) => {
    try {
      await CoursedProgramService.updateById(id, data)
    } catch (error) {
      logger.error("Error updating coursed program:", error)
      throw error
    }
  }, [])

  const getProgramVersionInfo = useCallback(async (programVersionId: number) => {
    try {
      return await ProgramVersionService.getById(programVersionId)
    } catch (error) {
      logger.error("Error getting program version info:", error)
      throw error
    }
  }, [])

  const createAcademicEducation = useCallback(async (data: {
    userId: string
    type: "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER"
    studyName: string
    institution: string
    country: string
  }) => {
    try {
      await AcademicEducationService.create(data)
    } catch (error) {
      logger.error("Error creating academic education:", error)
      throw error
    }
  }, [])

  const updateAcademicEducation = useCallback(async (id: number, data: {
    userId: string
    type: "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER"
    studyName: string
    institution: string
    country: string
  }) => {
    try {
      await AcademicEducationService.updateById(id, data)
    } catch (error) {
      logger.error("Error updating academic education:", error)
      throw error
    }
  }, [])

  const createContactInformation = useCallback(async (data: {
    userId: string
    address: string
    country: string
    state: string
    city: string
    landline: string
    mobile: string
    email: string
    academicEmail: string
    whatsappAuthorization: boolean
  }) => {
    try {
      await ContactInformationService.create(data)
    } catch (error) {
      logger.error("Error creating contact information:", error)
      throw error
    }
  }, [])

  const updateContactInformation = useCallback(async (id: number, data: {
    userId: string
    address: string
    country: string
    state: string
    city: string
    landline: string
    mobile: string
    email: string
    academicEmail: string
    whatsappAuthorization: boolean
  }) => {
    try {
      await ContactInformationService.updateById(id, data)
    } catch (error) {
      logger.error("Error updating contact information:", error)
      throw error
    }
  }, [])

  const createFamilyInformation = useCallback(async (data: {
    userId: string
    maritalState: string
    childNumber: number
  }) => {
    try {
      await FamilyInformationService.create(data)
    } catch (error) {
      logger.error("Error creating family information:", error)
      throw error
    }
  }, [])

  const updateFamilyInformation = useCallback(async (id: number, data: {
    userId: string
    maritalState: string
    childNumber: number
  }) => {
    try {
      await FamilyInformationService.updateById(id, data)
    } catch (error) {
      logger.error("Error updating family information:", error)
      throw error
    }
  }, [])

  const value: ProfileContextType = {
    createCoursedProgram,
    updateCoursedProgram,
    getProgramVersionInfo,
    createAcademicEducation,
    updateAcademicEducation,
    createContactInformation,
    updateContactInformation,
    createFamilyInformation,
    updateFamilyInformation,
    getUserId,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
} 