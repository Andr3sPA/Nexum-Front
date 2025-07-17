"use client"

import { Card, CardHeader, CardContent } from "@/components/molecules/card"
import { EditButton } from "@/components/atoms/edit-button"
import { DetailedGraduateParticipationResponse } from "@/lib/services/profile/detailed-user.service"
import { Users } from "lucide-react"

interface ParticipationInfoCardProps {
  participationInfo: DetailedGraduateParticipationResponse
  onEdit?: () => void
}

export function ParticipationInfoCard({ participationInfo, onEdit }: ParticipationInfoCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Información de Participación</h3>
              <p className="text-sm text-neutral-600">Disposición y intereses de participación</p>
            </div>
          </div>
          {onEdit && <EditButton onClick={onEdit} text="Editar" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Continuous Education Interests */}
        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-medium text-gray-700">Intereses de Formación Continua</h4>
          <p className="text-gray-900">
            {participationInfo.continuousEducationInterests?.length > 0 
              ? participationInfo.continuousEducationInterests.join(", ")
              : "No especificado"
            }
          </p>
        </div>
        
        {/* Willingness to Participate */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Disposición para Participar</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: "willingToBeSpeaker", label: "Conferencista" },
              { key: "willingToBeProfessor", label: "Profesor" },
              { key: "willingToTeachNonFormalEducation", label: "Profesor no formal" },
              { key: "willingToBePostgraduateStudent", label: "Estudiante posgrado" },
              { key: "willingToBeNonFormalStudent", label: "Estudiante no formal" },
              { key: "willingToBeGraduateRepresentative", label: "Representante egresados" },
              { key: "willingToAttendAlumniMeetings", label: "Encuentros egresados" },
              { key: "willingToParticipateInAlumniActivities", label: "Actividades egresados" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-gray-700">{label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  participationInfo[key as keyof DetailedGraduateParticipationResponse] 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {participationInfo[key as keyof DetailedGraduateParticipationResponse] ? "Sí" : "No"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 