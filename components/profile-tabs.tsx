"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Edit } from "lucide-react"
import PersonalInfoTab from "@/components/organisms/tabs/personal-info-tab"
import AcademicInfoTab from "@/components/organisms/tabs/academic-info-tab"
import CurrentJobModal, { type CurrentJobData } from "@/components/organisms/tabs/work-info-tab"
import ParticipationTab from "@/components/organisms/tabs/participation-tab"
import EvaluationTab from "@/components/organisms/tabs/evaluation-tab"
import { FirstJobModal } from "@/components/organisms/modals/work-first-job-modal"
import { WorkQuestionsModal } from "@/components/organisms/modals/work-questions-modal"
import { logger } from "@/lib/logging"

// Work Questions Display Component
const WorkQuestionsDisplay = ({ data, onEdit }: { data: WorkQuestionsData; onEdit: () => void }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-semibold text-primary" style={{ fontSize: '24px', fontWeight: 600, fontStyle: 'normal' }}>Preguntas Laborales</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Perfiles en los que se ha desempeñado</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.profiles || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>El perfil de formación ofrecido por el programa para su desarrollo profesional y laboral, ha sido adecuado? (califique de 1 a 5)</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.formationRating || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>De acuerdo con el proyecto formativo que cursó en el Programa, las siguientes competencias han sido adecuadas para su desarrollo profesional y laboral</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>
            {data.competencies && data.competencies.length > 0 
              ? data.competencies.map(comp => {
                  // Convertir el valor de la competencia a un formato más legible
                  const readableComp = comp
                    .replace("gestion_bases_datos", "Gestión de bases de datos")
                    .replace("analisis_diseno_sistemas", "Análisis y diseño de sistemas")
                    .replace("programacion_lenguajes", "Programación en múltiples lenguajes")
                    .replace("desarrollo_web", "Desarrollo web")
                    .replace("seguridad_informatica", "Seguridad informática")
                    .replace("inteligencia_artificial", "Inteligencia artificial")
                    .replace("gestion_proyectos", "Gestión de proyectos");
                  return readableComp;
                }).join(", ")
              : "No hay datos"}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Current Job Display Component
const CurrentJobDisplay = ({ data, onEdit }: { data: CurrentJobData; onEdit: () => void }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-semibold text-primary" style={{ fontSize: '24px', fontWeight: 600, fontStyle: 'normal' }}>Información Laboral Actual</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Su situación actual es</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.currentSituation || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Nombre de la empresa</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.companyName || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Cargo</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.position || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Cargo relacionado con la carrera</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.relatedToCareer === "si" ? "Sí" : data.relatedToCareer === "no" ? "No" : "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Rango salarial actual (SMLV)</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.salaryRange || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Tiempo que lleva en la empresa</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.timeInCompany || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Área de empleo actual</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.area || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Tipo de empresa</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.companyType || "No hay datos"}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

// First Job Display Component
const FirstJobDisplay = ({ data, onEdit }: { data: FirstJobData; onEdit: () => void }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-semibold text-primary" style={{ fontSize: '24px', fontWeight: 600, fontStyle: 'normal' }}>Información Laboral Primer Empleo</CardTitle>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Nombre de la empresa</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.companyName || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>País</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>
            {data.country ? (
              data.country === "colombia" ? "Colombia" :
              data.country === "argentina" ? "Argentina" :
              data.country === "brasil" ? "Brasil" :
              data.country === "chile" ? "Chile" :
              data.country === "ecuador" ? "Ecuador" :
              data.country === "mexico" ? "México" :
              data.country === "peru" ? "Perú" :
              data.country === "venezuela" ? "Venezuela" :
              data.country === "espana" ? "España" :
              data.country === "estados_unidos" ? "Estados Unidos" :
              data.country === "canada" ? "Canadá" :
              data.country === "otro" ? "Otro" : data.country
            ) : "No hay datos"}
          </p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Cargo</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.position || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Cargo relacionado con la carrera</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.relatedToCareer === "si" ? "Sí" : data.relatedToCareer === "no" ? "No" : "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Tiempo promedio en el que obtuviste el primer empleo (Relacionado con la carrera)</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.timeToFirstJob || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Rango salarial de su primer empleo (SMLV)</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.salaryRange || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Área de su primer empleo</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.area || "No hay datos"}</p>
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: 'rgb(55 65 81)' }}>Tipo de empresa de su primer empleo</p>
          <p className="text-sm" style={{ color: 'rgb(17 24 39)' }}>{data.companyType || "No hay datos"}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Define interfaces for the different work-related data types
interface WorkQuestionsData {
  profiles: string
  formationRating: string
  competencies: string[]
  question1: string
  question2: string
  question3: string
  updateDate?: string
}

interface FirstJobData {
  company: string
  position: string
  startDate: string
  endDate: string
  sector: string
  contractType: string
  salary: string
  city: string
  country: string
  companyName: string
  relatedToCareer: string
  timeToFirstJob: string
  salaryRange: string
  area: string
  companyType: string
  updateDate?: string
}

export default function ProfileTabs() {
  // State for work questions modal
  const [isWorkQuestionsModalOpen, setIsWorkQuestionsModalOpen] = useState(false)
  const [workQuestionsData, setWorkQuestionsData] = useState<WorkQuestionsData>({
    profiles: "",
    formationRating: "",
    competencies: [],
    question1: "",
    question2: "",
    question3: "",
    updateDate: "",
  })

  // State for current job modal
  const [isCurrentJobModalOpen, setIsCurrentJobModalOpen] = useState(false)
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

  // State for first job modal
  const [isFirstJobModalOpen, setIsFirstJobModalOpen] = useState(false)
  const [firstJobData, setFirstJobData] = useState<FirstJobData>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    sector: "",
    contractType: "",
    salary: "",
    city: "",
    country: "",
    companyName: "",
    relatedToCareer: "",
    timeToFirstJob: "",
    salaryRange: "",
    area: "",
    companyType: "",
    updateDate: "",
  })

  // Handlers for saving data
  const handleSaveWorkQuestionsData = (data: WorkQuestionsData) => {
    logger.info("Saving work questions data:", data)
    setWorkQuestionsData({ ...data, updateDate: new Date().toISOString() })
    setIsWorkQuestionsModalOpen(false)
  }

  const handleSaveCurrentJobData = (data: CurrentJobData) => {
    logger.info("Saving current job data:", data)
    setCurrentJobData({ ...data, updateDate: new Date().toISOString() })
    setIsCurrentJobModalOpen(false)
  }

  const handleSaveFirstJobData = (data: FirstJobData) => {
    logger.info("Saving first job data:", data)
    setFirstJobData({ ...data, updateDate: new Date().toISOString() })
    setIsFirstJobModalOpen(false)
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
          <FirstJobDisplay data={firstJobData} onEdit={() => setIsFirstJobModalOpen(true)} />
          <CurrentJobDisplay data={currentJobData} onEdit={() => setIsCurrentJobModalOpen(true)} />
          <WorkQuestionsDisplay data={workQuestionsData} onEdit={() => setIsWorkQuestionsModalOpen(true)} />
        </TabsContent>

        <TabsContent value="participation" className="mt-6">
          <ParticipationTab />
        </TabsContent>

        <TabsContent value="evaluation" className="mt-6">
          <EvaluationTab />
        </TabsContent>
      </Tabs>

      <WorkQuestionsModal
        isOpen={isWorkQuestionsModalOpen}
        onClose={() => setIsWorkQuestionsModalOpen(false)}
        onSave={handleSaveWorkQuestionsData}
        initialData={workQuestionsData}
      />
      
      <CurrentJobModal
        isOpen={isCurrentJobModalOpen}
        onClose={() => setIsCurrentJobModalOpen(false)}
        onSave={handleSaveCurrentJobData}
        initialData={currentJobData}
      />
      
      <FirstJobModal
        isOpen={isFirstJobModalOpen}
        onClose={() => setIsFirstJobModalOpen(false)}
        onSave={handleSaveFirstJobData}
        initialData={firstJobData}
      />
    </>
  )
}
