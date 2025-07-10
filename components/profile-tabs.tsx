"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalInfoTab from "@/components/organisms/tabs/personal-info-tab"
import { AcademicInfoTab } from "@/components/organisms/tabs/academic-info-tab"
import WorkInfoTab from "@/components/organisms/tabs/work-info-tab"
import ParticipationTab from "@/components/organisms/tabs/participation-tab"
import EvaluationTab from "@/components/organisms/tabs/evaluation-tab"
import { logger } from "@/lib/logging"
import { DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"

interface ProfileTabsProps {
  userProfile?: DetailedUserResponse & { email?: string };
}

export default function ProfileTabs({ userProfile }: ProfileTabsProps) {
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

  return (
    <>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="academic">Información Académica</TabsTrigger>
          <TabsTrigger value="work">Información Laboral</TabsTrigger>
          <TabsTrigger value="participation">Participación</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluación Programa</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoTab userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <AcademicInfoTab 
            academicData={userProfile?.coursedPrograms || []}
            postGraduateData={userProfile?.academicEducationList || []}
            onDataUpdate={() => {
              // TODO: Implement data update logic
              logger.info("Academic data updated")
            }}
          />
        </TabsContent>

        <TabsContent value="work" className="mt-6">
          <WorkInfoTab userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="participation" className="mt-6">
          <ParticipationTab userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="evaluation" className="mt-6">
          <EvaluationTab userProfile={userProfile} />
        </TabsContent>
      </Tabs>
    </>
  )
}
