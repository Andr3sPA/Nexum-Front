"use client"

import { useState } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import { AddButton } from "@/components/atoms/add-button"
import AcademicInfoModal from "@/components/organisms/modals/academic-info-modal"
import PostGraduateModal from "@/components/organisms/modals/post-graduate-modal"

export default function AcademicInfoTab() {
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false)
  const [isPostGradModalOpen, setIsPostGradModalOpen] = useState(false)

  const [academicData, setAcademicData] = useState({
    graduationYear: "",
    program: "",
    studyPlan: "",
    role: "",
  })

  const [postGradData, setPostGradData] = useState([
    {
      id: 1,
      type: "",
      name: "",
      institution: "",
      country: "",
    },
  ])

  const handleAcademicSave = (data: typeof academicData) => {
    setAcademicData(data)
    setIsAcademicModalOpen(false)
    // TODO: Send data to backend
  }

  const handlePostGradSave = (data: typeof postGradData) => {
    setPostGradData(data)
    setIsPostGradModalOpen(false)
    // TODO: Send data to backend
  }

  const addPostGradEntry = () => {
    setPostGradData((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "",
        name: "",
        institution: "",
        country: "",
      },
    ])
    setIsPostGradModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <DataSection title="Información Académica" action={<EditButton onClick={() => setIsAcademicModalOpen(true)} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Año de Graduación" value={academicData.graduationYear} />
          <DataField label="Programa Cursado en la UdeA" value={academicData.program} />
          <DataField label="Plan de Estudios" value={academicData.studyPlan} />
          <DataField label="Durante su formación fue" value={academicData.role} />
        </div>
      </DataSection>

      {/* Post-Graduate Information */}
      <DataSection
        title="Información Académica Pos Pregrado"
        action={
          <div className="flex gap-2">
            <AddButton onClick={addPostGradEntry} />
            <EditButton onClick={() => setIsPostGradModalOpen(true)} />
          </div>
        }
      >
        {postGradData.map((entry, index) => (
          <div key={entry.id} className="mb-6 p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Estudio {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Tipo" value={entry.type} />
              <DataField label="Nombre del Estudio" value={entry.name} />
              <DataField label="Institución" value={entry.institution} />
              <DataField label="País" value={entry.country} />
            </div>
          </div>
        ))}
      </DataSection>

      <AcademicInfoModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
        onSave={handleAcademicSave}
        initialData={academicData}
      />

      <PostGraduateModal
        isOpen={isPostGradModalOpen}
        onClose={() => setIsPostGradModalOpen(false)}
        onSave={handlePostGradSave}
        initialData={postGradData}
      />
    </div>
  )
}
