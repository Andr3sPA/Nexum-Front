"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EvaluationModal from "../modals/evaluation-modal"

export default function EvaluationTab() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [evaluationData, setEvaluationData] = useState({
    strengths: "",
    weaknesses: "",
    additionalCompetencies: [], // Multi-select dropdown
    question1: "",
    question2: "",
    question3: "",
  })

  const handleSave = (data: typeof evaluationData) => {
    setEvaluationData(data)
    setIsModalOpen(false)
    // TODO: Send data to backend with proper validation
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Evaluación del Programa</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
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
                ¿Cuáles competencias o cursos que consideras deberían adicionarse a la formación en el programa de
                egreso?
              </label>
              <p className="text-gray-900 mt-2 p-3 bg-gray-50 rounded-md min-h-[60px]">
                {evaluationData.additionalCompetencies.length > 0
                  ? evaluationData.additionalCompetencies.join(", ")
                  : "No hay datos"}
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
        </CardContent>
      </Card>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={evaluationData}
      />
    </div>
  )
}
