"use client"

import { useState } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import WorkFirstJobModal from "@/components/organisms/modals/work-first-job-modal"
import WorkCurrentJobModal from "@/components/organisms/modals/work-current-job-modal"
import WorkQuestionsModal from "@/components/organisms/modals/work-questions-modal"

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
    updateDate: "",
  })

  const [workQuestionsData, setWorkQuestionsData] = useState({
    profiles: "",
    formationRating: "",
    competencies: "",
    question1: "",
    question2: "",
    question3: "",
  })

  const handleFirstJobSave = (data: typeof firstJobData) => {
    setFirstJobData(data)
    setIsFirstJobModalOpen(false)
    // TODO: Send data to backend
  }

  const handleCurrentJobSave = (data: typeof currentJobData) => {
    setCurrentJobData(data)
    setIsCurrentJobModalOpen(false)
    // TODO: Send data to backend
  }

  const handleQuestionsSave = (data: typeof workQuestionsData) => {
    setWorkQuestionsData(data)
    setIsQuestionsModalOpen(false)
    // TODO: Send data to backend
  }

  return (
    <div className="space-y-6">
      {/* First Job Information */}
      <DataSection
        title="Información Laboral Primer Empleo"
        action={<EditButton onClick={() => setIsFirstJobModalOpen(true)} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Nombre de la empresa" value={firstJobData.companyName} />
          <DataField label="País" value={firstJobData.country} />
          <DataField label="Cargo" value={firstJobData.position} />
          <DataField label="Cargo relacionado con la carrera" value={firstJobData.relatedToCareer} />
          <DataField label="Tiempo promedio primer empleo" value={firstJobData.timeToFirstJob} />
          <DataField label="Rango salarial primer empleo (SMLV)" value={firstJobData.salaryRange} />
          <DataField label="Área de su primer empleo" value={firstJobData.area} />
          <DataField label="Tipo de empresa" value={firstJobData.companyType} />
        </div>
      </DataSection>

      {/* Current Job Information */}
      <DataSection
        title="Información Laboral Actual"
        action={<EditButton onClick={() => setIsCurrentJobModalOpen(true)} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Su situación actual es" value={currentJobData.currentSituation} />
          <DataField label="Nombre de la empresa" value={currentJobData.companyName} />
          <DataField label="Cargo" value={currentJobData.position} />
          <DataField label="Cargo relacionado con la carrera" value={currentJobData.relatedToCareer} />
          <DataField label="Rango salarial actual (SMLV)" value={currentJobData.salaryRange} />
          <DataField label="Tiempo en la empresa" value={currentJobData.timeInCompany} />
          <DataField label="Área de empleo actual" value={currentJobData.area} />
          <DataField label="Tipo de empresa" value={currentJobData.companyType} />
          <DataField label="Fecha de actualización" value={currentJobData.updateDate} />
        </div>
      </DataSection>

      {/* Work Questions */}
      <DataSection title="Preguntas Laborales" action={<EditButton onClick={() => setIsQuestionsModalOpen(true)} />}>
        <div className="space-y-4">
          <DataField label="Perfiles en los que se ha desempeñado" value={workQuestionsData.profiles} />
          <DataField label="El perfil de formación ha sido adecuado (1-5)" value={workQuestionsData.formationRating} />
          <DataField label="Competencias adecuadas" value={workQuestionsData.competencies} />
          <DataField label="Pregunta 1" value={workQuestionsData.question1} />
          <DataField label="Pregunta 2" value={workQuestionsData.question2} />
          <DataField label="Pregunta 3" value={workQuestionsData.question3} />
        </div>
      </DataSection>

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
