"use client"

import { useState, useEffect } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { EditButton } from "@/components/atoms/edit-button"
import EvaluationModal from "@/components/organisms/modals/evaluation-modal"
import { DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"

// Import the EvaluationData type from the modal to ensure consistency
interface EvaluationData {
  programSatisfaction: string
  teacherQuality: string
  infrastructureQuality: string
  administrativeSupport: string
  overallExperience: string
  comments: string
  strengths: string
  weaknesses: string
  additionalCompetencies: string
  question1: string
  question2: string
  question3: string
}

interface EvaluationTabProps {
  userProfile?: DetailedUserResponse;
}

export default function EvaluationTab({ userProfile }: EvaluationTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    programSatisfaction: "",
    teacherQuality: "",
    infrastructureQuality: "",
    administrativeSupport: "",
    overallExperience: "",
    comments: "",
    strengths: "",
    weaknesses: "",
    additionalCompetencies: "",
    question1: "",
    question2: "",
    question3: "",
  })

  // Update data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setEvaluationData({
        programSatisfaction: "",
        teacherQuality: "",
        infrastructureQuality: "",
        administrativeSupport: "",
        overallExperience: "",
        comments: "",
        strengths: userProfile?.coursedPrograms?.[0]?.strengths?.join(", ") || "",
        weaknesses: userProfile?.coursedPrograms?.[0]?.weaknesses?.join(", ") || "",
        additionalCompetencies: userProfile?.coursedPrograms?.[0]?.improvementSuggestions?.join(", ") || "",
        question1: "",
        question2: "",
        question3: "",
      })
    }
  }, [userProfile])

  const handleSave = (data: EvaluationData) => {
    setEvaluationData(data)
    setIsModalOpen(false)
    // TODO: Send data to backend
  }

  return (
    <div className="space-y-6">
      <DataSection title="Evaluación del Programa" action={<EditButton onClick={() => setIsModalOpen(true)} />}>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              ¿Cuáles crees que son las fortalezas de la formación en el programa de egreso?
            </label>
            <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
              {evaluationData.strengths || "No hay datos"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              ¿Cuáles crees que son las debilidades de la formación en el programa de egreso?
            </label>
            <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
              {evaluationData.weaknesses || "No hay datos"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              ¿Cuáles competencias o cursos consideras deberían adicionarse a la formación?
            </label>
            <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
              {evaluationData.additionalCompetencies || "No hay datos"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Pregunta 1</label>
            <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
              {evaluationData.question1 || "No hay datos"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Pregunta 2</label>
            <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
              {evaluationData.question2 || "No hay datos"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Pregunta 3</label>
            <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
              {evaluationData.question3 || "No hay datos"}
            </p>
          </div>
        </div>
      </DataSection>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={evaluationData}
      />
    </div>
  )
}