"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/tabs"
import PersonalInfoTab from "@/components/organisms/tabs/personal-info-tab"
import { AcademicInfoTab } from "@/components/organisms/tabs/academic-info-tab"
import WorkInfoTab from "@/components/organisms/tabs/work-info-tab"
import ParticipationTab from "@/components/organisms/tabs/participation-tab"
import EvaluationTab from "@/components/organisms/tabs/evaluation-tab"
import { logger } from "@/lib/logging"
import { DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { useAuth } from "@/contexts/auth-context"
import { ROLES } from "@/lib/services/constants/api.constants"

interface ProfileTabsProps {
  userProfile?: DetailedUserResponse & { email?: string }
  isViewOnly?: boolean
  onDataUpdate?: () => Promise<void>
  currentUserRole?: string
}

export default function ProfileTabs({ userProfile, isViewOnly = false, onDataUpdate, currentUserRole }: ProfileTabsProps) {
  const { user } = useAuth()

  // Determine which tabs to show based on user role
  // Use the prop if provided, otherwise get from auth context
  const userRole = (currentUserRole || user?.role || '').toUpperCase()



  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "personal", label: "Información Personal", component: "personal" },
      { id: "academic", label: "Información Académica", component: "academic" },
      { id: "work", label: "Información Laboral", component: "work" },
      { id: "participation", label: "Participación", component: "participation" }
    ]

    // If no user or no role, show all tabs
    if (!userRole) {
      return baseTabs
    }

    switch (userRole) {
      case 'EMPLOYER':
      case 'employer':
        // Employers see only work-related information
        return [
          { id: "personal", label: "Información Personal", component: "personal" },
          { id: "work", label: "Información Laboral", component: "work" }
        ]
      case 'DEAN':
      case 'dean':
        // Deans see academic and participation information
        return [
          { id: "academic", label: "Información Académica", component: "academic" },
          { id: "participation", label: "Participación", component: "participation" }
        ]
      case 'ADMINISTRATIVE':
      case 'administrative':
        // Administrative staff see academic and participation information
        return [
          { id: "academic", label: "Información Académica", component: "academic" },
          { id: "participation", label: "Participación", component: "participation" }
        ]
      case 'ADMIN':
      case 'admin':
        // Admins see all information
        return baseTabs
      case 'GRADUATE':
      case 'graduate':
      case 'PRE_GRADUATE':
      case 'pre_graduate':
      default:
        // Graduates and others see all information
        return baseTabs
    }
  }

  const availableTabs = getAvailableTabs()

  // Initialize data from detailed user profile
  useEffect(() => {
    if (userProfile) {
      // Initialize participation data if available
      if (userProfile.graduateParticipation) {
        // This could be used to populate participation tab data
        logger.info("Graduate participation data available:", userProfile.graduateParticipation)
      }

      // Initialize academic data if available
      if (userProfile.coursedPrograms && userProfile.coursedPrograms.length > 0) {
        // This could be used to populate academic tab data
        logger.info("Academic programs data available:", userProfile.coursedPrograms)
      }
    }
  }, [userProfile])

  const handleDataUpdate = async () => {
    if (onDataUpdate) {
      try {
        await onDataUpdate()
        logger.info("Profile data updated successfully")
      } catch (error) {
        logger.error("Error updating profile data:", error)
      }
    }
  }

  return (
    <>
      <Tabs defaultValue={availableTabs[0]?.id || "personal"} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
          {availableTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.some(tab => tab.id === "personal") && (
          <TabsContent value="personal">
            <PersonalInfoTab userProfile={userProfile} isViewOnly={isViewOnly} onDataUpdate={handleDataUpdate} />
          </TabsContent>
        )}

        {availableTabs.some(tab => tab.id === "academic") && (
          <TabsContent value="academic">
            <AcademicInfoTab
              academicData={userProfile?.coursedPrograms || []}
              postGraduateData={userProfile?.academicEducationList || []}
              isViewOnly={isViewOnly}
              onDataUpdate={handleDataUpdate}
              userId={userProfile?.id || ""}
            />
          </TabsContent>
        )}

        {availableTabs.some(tab => tab.id === "work") && (
          <TabsContent value="work">
            <WorkInfoTab userProfile={userProfile} isViewOnly={isViewOnly} onDataUpdate={handleDataUpdate} />
          </TabsContent>
        )}

        {availableTabs.some(tab => tab.id === "participation") && (
          <TabsContent value="participation">
            <ParticipationTab userProfile={userProfile} isViewOnly={isViewOnly} onDataUpdate={handleDataUpdate} />
          </TabsContent>
        )}
      </Tabs>
    </>
  )
}
