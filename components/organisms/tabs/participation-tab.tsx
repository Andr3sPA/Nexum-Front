"use client"

import { useState } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import ParticipationModal from "@/components/organisms/modals/participation-modal"

export default function ParticipationTab() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // FIXED: Now includes ALL properties from ParticipationData interface
  const [participationData, setParticipationData] = useState({
    // Missing properties that were causing build errors:
    participationType: "",
    eventName: "",
    eventDate: "",
    role: "",
    description: "",
    // Existing properties:
    participation: "",
    conferenceInterest: "",
    professorInterest: "",
    nonFormalProfessorInterest: "",
    postgraduateInterest: "",
    nonFormalStudentInterest: "",
    continuousFormationTopics: "",
    representativeInterest: "",
    meetingsInterest: "",
    activitiesInterest: "",
  })

  const handleSave = (data: typeof participationData) => {
    setParticipationData(data)
    setIsModalOpen(false)
    // TODO: Send data to backend
  }

  return (
    <div className="space-y-6">
      <DataSection title="Participación" action={<EditButton onClick={() => setIsModalOpen(true)} />}>
        <div className="space-y-4">
          <DataField label="Desde su egreso ha participado en" value={participationData.participation} />
          <DataField
            label="Desea participar como conferencista en la UDEA"
            value={participationData.conferenceInterest}
          />
          <DataField label="Desea participar como profesor en la UDEA" value={participationData.professorInterest} />
          <DataField
            label="Desea participar como profesor de educación no formal en la UDEA"
            value={participationData.nonFormalProfessorInterest}
          />
          <DataField
            label="Desearía participar como estudiante de posgrado de la UDEA"
            value={participationData.postgraduateInterest}
          />
          <DataField
            label="Desearía participar como estudiante de formación no formal"
            value={participationData.nonFormalStudentInterest}
          />
          <DataField
            label="En qué temas le interesaría realizar formación continua"
            value={participationData.continuousFormationTopics}
          />
          <DataField
            label="Te gustaría ser representante de los egresados"
            value={participationData.representativeInterest}
          />
          <DataField
            label="Te gustaría participar en encuentros de egresados"
            value={participationData.meetingsInterest}
          />
          <DataField
            label="Te gustaría escribir o participar en actividades para egresados"
            value={participationData.activitiesInterest}
          />
        </div>
      </DataSection>

      <ParticipationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={participationData}
      />
    </div>
  )
}

