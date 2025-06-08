"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WorkFirstJobModal from "../modals/work-first-job-modal"
import WorkCurrentJobModal from "../modals/work-current-job-modal"
import WorkQuestionsModal from "../modals/work-questions-modal"

export default function WorkInfoTab() {
  const [isFirstJobModalOpen, setIsFirstJobModalOpen] = useState(false)
  const [isCurrentJobModalOpen, setIsCurrentJobModalOpen] = useState(false)
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false)

  const [firstJobData, setFirstJobData] = useState({
    companyName: "",
    country: "",
    position: "",
    relatedToCareer: "",
    timeToFirstJob: "",
    salaryRange: "",
    area: "",
    companyType: "",
  })

  const [currentJobData, setCurrentJobData] = useState({
    currentSituation: "",
    companyName: "",
    position: "",
    relatedToCareer: "",
    salaryRange: "",
    timeInCompany: "",
    area: "",
    companyType: "",
  })

  const [workQuestionsData, setWorkQuestionsData] = useState({
    profiles: "",
    formationRating: "",
    competencies: [], // Changed to array for multi-select
  })

  const handleFirstJobSave = (data: typeof firstJobData) => {
    setFirstJobData(data)
    setIsFirstJobModalOpen(false)
    // TODO: Send data to backend with proper validation
  }

  const handleCurrentJobSave = (data: typeof currentJobData) => {
    setCurrentJobData(data)
    setIsCurrentJobModalOpen(false)
    // TODO: Send data to backend with proper validation
  }

  const handleQuestionsSave = (data: typeof workQuestionsData) => {
    setWorkQuestionsData(data)
    setIsQuestionsModalOpen(false)
    // TODO: Send data to backend with proper validation
  }

  return (
    <div className="space-y-6">
      {/* First Job Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Información Laboral Primer Empleo</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFirstJobModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre de la empresa</label>
              <p className="text-gray-900">{firstJobData.companyName || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">País</label>
              <p className="text-gray-900">{firstJobData.country || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cargo</label>
              <p className="text-gray-900">{firstJobData.position || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cargo relacionado con la carrera</label>
              <p className="text-gray-900">{firstJobData.relatedToCareer || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tiempo promedio en el que obtuviste el primer empleo (Relacionado con la carrera)
              </label>
              <p className="text-gray-900">{firstJobData.timeToFirstJob || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rango salarial de su primer empleo (SMLV)</label>
              <p className="text-gray-900">{firstJobData.salaryRange || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Área de su primer empleo</label>
              <p className="text-gray-900">{firstJobData.area || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de empresa de su primer empleo</label>
              <p className="text-gray-900">{firstJobData.companyType || "No hay datos"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Job Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Información Laboral Actual</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCurrentJobModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Su situación actual es</label>
              <p className="text-gray-900">{currentJobData.currentSituation || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre de la empresa</label>
              <p className="text-gray-900">{currentJobData.companyName || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cargo</label>
              <p className="text-gray-900">{currentJobData.position || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Cargo relacionado con la carrera</label>
              <p className="text-gray-900">{currentJobData.relatedToCareer || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rango salarial de su primer empleo (SMLV)</label>
              <p className="text-gray-900">{currentJobData.salaryRange || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tiempo que lleva en la empresa</label>
              <p className="text-gray-900">{currentJobData.timeInCompany || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Área de empleo actual</label>
              <p className="text-gray-900">{currentJobData.area || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de empresa</label>
              <p className="text-gray-900">{currentJobData.companyType || "No hay datos"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Preguntas Laborales</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQuestionsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Perfiles en los que se ha desempeñado</label>
              <p className="text-gray-900">{workQuestionsData.profiles || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                El perfil de formación ofrecido por el programa para su desarrollo profesional y laboral, ha sido
                adecuado? (califique de 1 a 5)
              </label>
              <p className="text-gray-900">{workQuestionsData.formationRating || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                De acuerdo con el proyecto formativo que cursó en el Programa, las siguientes competencias han sido
                adecuadas para su desarrollo profesional y laboral
              </label>
              <p className="text-gray-900">
                {workQuestionsData.competencies.length > 0 ? workQuestionsData.competencies.join(", ") : "No hay datos"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <WorkFirstJobModal
        isOpen={isFirstJobModalOpen}
        onClose={() => setIsFirstJobModalOpen(false)}
        onSave={handleFirstJobSave}
        initialData={firstJobData}
      />

      <WorkCurrentJobModal
        isOpen={isCurrentJobModalOpen}
        onClose={() => setIsCurrentJobModalOpen(false)}
        onSave={handleCurrentJobSave}
        initialData={currentJobData}
      />

      <WorkQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        onSave={handleQuestionsSave}
        initialData={workQuestionsData}
      />
    </div>
  )
}
