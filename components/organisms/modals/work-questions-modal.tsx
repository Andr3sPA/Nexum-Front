"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/atoms/label"
import { Textarea } from "@/components/atoms/textarea"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { MultiSelect, type MultiSelectOption } from "@/components/molecules/multi-select"

import { logger } from "@/lib/logging"

interface WorkQuestionsData {
  profiles: string
  formationRating: string
  competencies: string[]
  question1: string
  question2: string
  question3: string
  updateDate?: string
}

interface WorkQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: WorkQuestionsData) => void
  initialData?: WorkQuestionsData | null
}

// Default values for the form
const defaultFormData: WorkQuestionsData = {
  profiles: "",
  formationRating: "",
  competencies: [],
  question1: "",
  question2: "",
  question3: "",
  updateDate: ""
}

export function WorkQuestionsModal({ isOpen, onClose, onSave, initialData }: WorkQuestionsModalProps) {
  const [formData, setFormData] = useState<WorkQuestionsData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Use initialData if it exists, otherwise use default values
    setFormData(initialData || defaultFormData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(formData)
    } catch (error) {
      logger.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof WorkQuestionsData, value: string) => {
    setFormData((prev: WorkQuestionsData) => ({ ...prev, [field]: value }))
  }

  // Competency options for the MultiSelect component
  const competencyOptions: MultiSelectOption[] = [
    { value: "gestion_bases_datos", label: "Gestión de bases de datos" },
    { value: "analisis_diseno_sistemas", label: "Análisis y diseño de sistemas" },
    { value: "programacion_lenguajes", label: "Programación en múltiples lenguajes" },
    { value: "desarrollo_web", label: "Desarrollo web" },
    { value: "seguridad_informatica", label: "Seguridad informática" },
    { value: "inteligencia_artificial", label: "Inteligencia artificial" },
    { value: "gestion_proyectos", label: "Gestión de proyectos" },
  ]

  const handleCompetencyChange = (selected: string[]) => {
    setFormData((prev) => ({ ...prev, competencies: selected }))
  }

  return (
    <ModalContainer 
      title="Preguntas Adicionales" 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      }
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Satisfacción Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="jobSatisfaction" label="¿Qué tan satisfecho está con su trabajo actual?">
                <Select
                  value={formData?.jobSatisfaction || ""}
                  onChange={(e) => handleInputChange("jobSatisfaction", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>

              <FormField id="salarySatisfaction" label="¿Qué tan satisfecho está con su salario?">
                <Select
                  value={formData?.salarySatisfaction || ""}
                  onChange={(e) => handleInputChange("salarySatisfaction", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Desarrollo Profesional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="careerGrowth" label="¿Qué tan satisfecho está con las oportunidades de crecimiento?">
                <Select
                  value={formData?.careerGrowth || ""}
                  onChange={(e) => handleInputChange("careerGrowth", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>

              <FormField id="trainingOpportunities" label="¿Qué tan satisfecho está con las oportunidades de capacitación?">
                <Select
                  value={formData?.trainingOpportunities || ""}
                  onChange={(e) => handleInputChange("trainingOpportunities", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ambiente Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="workEnvironment" label="¿Qué tan satisfecho está con el ambiente laboral?">
                <Select
                  value={formData?.workEnvironment || ""}
                  onChange={(e) => handleInputChange("workEnvironment", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>

              <FormField id="workLifeBalance" label="¿Qué tan satisfecho está con el balance trabajo-vida?">
                <Select
                  value={formData?.workLifeBalance || ""}
                  onChange={(e) => handleInputChange("workLifeBalance", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Perspectivas Futuras</h3>
            <FormField id="futurePlans" label="¿Cuáles son sus planes profesionales a futuro?">
              <Textarea
                id="futurePlans"
                value={formData?.futurePlans || ""}
                onChange={(e) => handleInputChange("futurePlans", e.target.value)}
                rows={4}
                placeholder="Describa sus planes profesionales y objetivos de carrera"
              />
            </FormField>
          </div>
        </div>
      </div>
    </ModalContainer>
  )
}
