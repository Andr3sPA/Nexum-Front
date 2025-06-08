"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ParticipationModal from "../modals/participation-modal"

export default function ParticipationTab() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [participationData, setParticipationData] = useState({
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Participación</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Desde su egreso ha participado en</label>
              <p className="text-gray-900">{participationData.participation || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Desea participar como conferencista en la Universidad de Antioquia?
              </label>
              <p className="text-gray-900">{participationData.conferenceInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Desea participar como profesor en la Universidad de Antioquia?
              </label>
              <p className="text-gray-900">{participationData.professorInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Desea participar como profesor de educación no formal en la Universidad de Antioquia?
              </label>
              <p className="text-gray-900">{participationData.nonFormalProfessorInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Desearía participar como estudiante de posgrado de la Universidad de Antioquia?
              </label>
              <p className="text-gray-900">{participationData.postgraduateInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Desearía participar como estudiante de formación no formal?
              </label>
              <p className="text-gray-900">{participationData.nonFormalStudentInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿En qué temas le interesaría realizar formación continua?
              </label>
              <p className="text-gray-900">{participationData.continuousFormationTopics || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Te gustaría ser representante de los egresados?
              </label>
              <p className="text-gray-900">{participationData.representativeInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Te gustaría participar en encuentros de egresados?
              </label>
              <p className="text-gray-900">{participationData.meetingsInterest || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Te gustaría escribir o participar en actividades para egresados?
              </label>
              <p className="text-gray-900">{participationData.activitiesInterest || "No hay datos"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ParticipationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={participationData}
      />
    </div>
  )
}
