"use client"

import { useState } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { EditButton } from "@/components/atoms/edit-button"
import EvaluationModal from "@/components/organisms/modals/evaluation-modal"

export default function EvaluationTab() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [evaluationData, setEvaluationData] = useState({
    strengths: "",
    weaknesses: "",
    additionalCompetencies: "",
    question1: "",
    question2: "",
    question3: "",
  })

  const handleSave = (data: typeof evaluationData) => {
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
