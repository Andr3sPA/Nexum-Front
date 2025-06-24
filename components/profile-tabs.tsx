"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import PersonalInfoTab from "@/components/organisms/tabs/personal-info-tab"
import AcademicInfoTab from "@/components/organisms/tabs/academic-info-tab"
import CurrentJobModal, { type CurrentJobData } from "@/components/organisms/tabs/work-info-tab"
import ParticipationTab from "@/components/organisms/tabs/participation-tab"
import EvaluationTab from "@/components/organisms/tabs/evaluation-tab"
import { logger } from "@/lib/logging"

const WorkInfoDisplay = ({ data, onEdit }: { data: CurrentJobData; onEdit: () => void }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Información Laboral Actual</CardTitle>
          <CardDescription>
            Última actualización: {data.updateDate ? new Date(data.updateDate).toLocaleDateString() : "N/A"}
          </CardDescription>
        </div>
        <Button onClick={onEdit}>Editar</Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p>
          <strong>Situación actual:</strong> {data.currentSituation || "No especificado"}
        </p>
        <p>
          <strong>Empresa:</strong> {data.companyName || "No especificado"}
        </p>
        <p>
          <strong>Cargo:</strong> {data.position || "No especificado"}
        </p>
        <p>
          <strong>Salario:</strong> {data.salaryRange || "No especificado"}
        </p>
      </div>
    </CardContent>
  </Card>
)

export default function ProfileTabs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentJobData, setCurrentJobData] = useState<CurrentJobData>({
    company: "",
    position: "",
    startDate: "",
    sector: "",
    contractType: "",
    salary: "",
    city: "",
    country: "",
    currentSituation: "desempleado",
    companyName: "",
    relatedToCareer: "",
    salaryRange: "",
    timeInCompany: "",
    area: "",
    companyType: "",
    updateDate: "",
  })

  const handleSaveWorkData = (data: CurrentJobData) => {
    logger.info("Saving work data:", data)
    setCurrentJobData({ ...data, updateDate: new Date().toISOString() })
    setIsModalOpen(false)
  }

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
          <PersonalInfoTab />
        </TabsContent>

        <TabsContent value="academic" className="mt-6">
          <AcademicInfoTab />
        </TabsContent>

        <TabsContent value="work" className="mt-6">
          <WorkInfoDisplay data={currentJobData} onEdit={() => setIsModalOpen(true)} />
        </TabsContent>

        <TabsContent value="participation" className="mt-6">
          <ParticipationTab />
        </TabsContent>

        <TabsContent value="evaluation" className="mt-6">
          <EvaluationTab />
        </TabsContent>
      </Tabs>

      <CurrentJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkData}
        initialData={currentJobData}
      />
    </>
  )
}
