"use client"

import { useState, useEffect } from "react"
import { TabContainer, TabSection, TabDataField } from "@/components/organisms/tab-container"
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
    <TabContainer 
      title="Evaluación del Programa"
      onEdit={() => setIsModalOpen(true)}
    >
      <TabSection title="Evaluación del Programa">
        <div className="space-y-6">
          <TabDataField
            label="¿Cuáles crees que son las fortalezas de la formación en el programa de egreso?"
            value={evaluationData.strengths}
          />
          <TabDataField
            label="¿Cuáles crees que son las debilidades de la formación en el programa de egreso?"
            value={evaluationData.weaknesses}
          />
          <TabDataField
            label="¿Cuáles competencias o cursos consideras deberían adicionarse a la formación?"
            value={evaluationData.additionalCompetencies}
          />
          <TabDataField
            label="Pregunta 1"
            value={evaluationData.question1}
          />
          <TabDataField
            label="Pregunta 2"
            value={evaluationData.question2}
          />
          <TabDataField
            label="Pregunta 3"
            value={evaluationData.question3}
          />
        </div>
      </TabSection>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={evaluationData}
      />
    </TabContainer>
  )
}