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

interface ProfileTabsProps {
  userProfile?: DetailedUserResponse & { email?: string }
  isViewOnly?: boolean
  onDataUpdate?: () => Promise<void>
}

export default function ProfileTabs({ userProfile, isViewOnly = false, onDataUpdate }: ProfileTabsProps) {
  console.log("📋 ProfileTabs rendered with:", { 
    hasUserProfile: !!userProfile, 
    isViewOnly, 
    hasOnDataUpdate: !!onDataUpdate 
  })
  
  // Initialize data from detailed user profile
  useEffect(() => {
    if (userProfile) {
      console.log("📋 ProfileTabs - userProfile data:", userProfile)
      
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
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="academic">Información Académica</TabsTrigger>
          <TabsTrigger value="work">Información Laboral</TabsTrigger>
          <TabsTrigger value="participation">Participación</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab userProfile={userProfile} isViewOnly={isViewOnly} onDataUpdate={handleDataUpdate} />
        </TabsContent>

        <TabsContent value="academic">
          <AcademicInfoTab 
            academicData={userProfile?.coursedPrograms || []}
            postGraduateData={userProfile?.academicEducationList || []}
            isViewOnly={isViewOnly}
            onDataUpdate={handleDataUpdate}
          />
        </TabsContent>

        <TabsContent value="work">
          <WorkInfoTab userProfile={userProfile} isViewOnly={isViewOnly} onDataUpdate={handleDataUpdate} />
        </TabsContent>

        <TabsContent value="participation">
          <ParticipationTab userProfile={userProfile} isViewOnly={isViewOnly} onDataUpdate={handleDataUpdate} />
        </TabsContent>
      </Tabs>
    </>
  )
}
