"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalInfoTab from "@/components/organisms/tabs/personal-info-tab"
import AcademicInfoTab from "@/components/organisms/tabs/academic-info-tab"
import WorkInfoTab from "@/components/organisms/tabs/work-info-tab"
import ParticipationTab from "@/components/organisms/tabs/participation-tab"
import EvaluationTab from "@/components/organisms/tabs/evaluation-tab"

export default function ProfileTabs() {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal">Información Personal</TabsTrigger>
        <TabsTrigger value="academic">Información Académica</TabsTrigger>
        <TabsTrigger value="work">Información Laboral</TabsTrigger>
        <TabsTrigger value="participation">Participación</TabsTrigger>
        <TabsTrigger value="evaluation">Evaluación Programa</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        <PersonalInfoTab />
      </TabsContent>

      <TabsContent value="academic" className="mt-6">
        <AcademicInfoTab />
      </TabsContent>

      <TabsContent value="work" className="mt-6">
        <WorkInfoTab />
      </TabsContent>

      <TabsContent value="participation" className="mt-6">
        <ParticipationTab />
      </TabsContent>

      <TabsContent value="evaluation" className="mt-6">
        <EvaluationTab />
      </TabsContent>
    </Tabs>
  )
}
