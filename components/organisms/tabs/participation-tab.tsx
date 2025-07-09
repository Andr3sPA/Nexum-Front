"use client"

import { useState, useEffect } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import ParticipationModal from "@/components/organisms/modals/participation-modal"
import { DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"

interface ParticipationTabProps {
  userProfile?: DetailedUserResponse;
}

export default function ParticipationTab({ userProfile }: ParticipationTabProps) {
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

  // Update data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setParticipationData({
        participationType: "",
        eventName: "",
        eventDate: "",
        role: "",
        description: "",
        participation: userProfile?.graduateParticipation?.participatedInnovationProcesses?.map(p => p.name).join(", ") || "",
        conferenceInterest: userProfile?.graduateParticipation?.willingToBeSpeaker ? "Sí" : "No",
        professorInterest: userProfile?.graduateParticipation?.willingToBeProfessor ? "Sí" : "No",
        nonFormalProfessorInterest: userProfile?.graduateParticipation?.willingToTeachNonFormalEducation ? "Sí" : "No",
        postgraduateInterest: userProfile?.graduateParticipation?.willingToBePostgraduateStudent ? "Sí" : "No",
        nonFormalStudentInterest: userProfile?.graduateParticipation?.willingToBeNonFormalStudent ? "Sí" : "No",
        continuousFormationTopics: userProfile?.graduateParticipation?.continuousEducationInterests?.join(", ") || "",
        representativeInterest: userProfile?.graduateParticipation?.willingToBeGraduateRepresentative ? "Sí" : "No",
        meetingsInterest: userProfile?.graduateParticipation?.willingToAttendAlumniMeetings ? "Sí" : "No",
        activitiesInterest: userProfile?.graduateParticipation?.willingToParticipateInAlumniActivities ? "Sí" : "No",
      })
    }
  }, [userProfile])

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

