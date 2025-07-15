"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

import { logger } from "@/lib/logging"

interface EvaluationData {
  programSatisfaction: string
  teacherQuality: string
  infrastructureQuality: string
  administrativeSupport: string
  overallExperience: string
  overallSatisfaction: string
  recommendProgram: string
  curriculumQuality: string
  facultyQuality: string
  practicalTraining: string
  jobPreparation: string
  skillsRelevance: string
  comments: string
  strengths: string
  weaknesses: string
  additionalCompetencies: string
  question1: string
  question2: string
  question3: string
}

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EvaluationData) => void
  initialData?: EvaluationData | null
}

// Default values for the form
const defaultFormData: EvaluationData = {
  programSatisfaction: "",
  teacherQuality: "",
  infrastructureQuality: "",
  administrativeSupport: "",
  overallExperience: "",
  overallSatisfaction: "",
  recommendProgram: "",
  curriculumQuality: "",
  facultyQuality: "",
  practicalTraining: "",
  jobPreparation: "",
  skillsRelevance: "",
  comments: "",
  strengths: "",
  weaknesses: "",
  additionalCompetencies: "",
  question1: "",
  question2: "",
  question3: ""
}

export default function EvaluationModal({ isOpen, onClose, onSave, initialData }: EvaluationModalProps) {
  const [formData, setFormData] = useState<EvaluationData>(defaultFormData)
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

  const handleInputChange = (field: keyof EvaluationData, value: string) => {
    setFormData((prev: EvaluationData) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer 
      title="Evaluación del Programa" 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl"
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Satisfacción General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="overallSatisfaction" label="¿Qué tan satisfecho está con el programa en general?">
                <Select
                  value={formData?.overallSatisfaction || ""}
                  onChange={(e) => handleInputChange("overallSatisfaction", e.target.value)}
                >
                  <option value="">Seleccionar nivel de satisfacción</option>
                  <option value="muy-satisfecho">Muy Satisfecho</option>
                  <option value="satisfecho">Satisfecho</option>
                  <option value="neutral">Neutral</option>
                  <option value="insatisfecho">Insatisfecho</option>
                  <option value="muy-insatisfecho">Muy Insatisfecho</option>
                </Select>
              </FormField>

              <FormField id="recommendProgram" label="¿Recomendaría el programa a otros?">
                <Select
                  value={formData?.recommendProgram || ""}
                  onChange={(e) => handleInputChange("recommendProgram", e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="definitivamente-si">Definitivamente Sí</option>
                  <option value="probablemente-si">Probablemente Sí</option>
                  <option value="no-seguro">No Estoy Seguro</option>
                  <option value="probablemente-no">Probablemente No</option>
                  <option value="definitivamente-no">Definitivamente No</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Aspectos Académicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="curriculumQuality" label="Calidad del currículo">
                <Select
                  value={formData?.curriculumQuality || ""}
                  onChange={(e) => handleInputChange("curriculumQuality", e.target.value)}
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="excelente">Excelente</option>
                  <option value="muy-bueno">Muy Bueno</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="pobre">Pobre</option>
                </Select>
              </FormField>

              <FormField id="facultyQuality" label="Calidad del cuerpo docente">
                <Select
                  value={formData?.facultyQuality || ""}
                  onChange={(e) => handleInputChange("facultyQuality", e.target.value)}
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="excelente">Excelente</option>
                  <option value="muy-bueno">Muy Bueno</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="pobre">Pobre</option>
                </Select>
              </FormField>

              <FormField id="infrastructureQuality" label="Calidad de la infraestructura">
                <Select
                  value={formData?.infrastructureQuality || ""}
                  onChange={(e) => handleInputChange("infrastructureQuality", e.target.value)}
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="excelente">Excelente</option>
                  <option value="muy-bueno">Muy Bueno</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="pobre">Pobre</option>
                </Select>
              </FormField>

              <FormField id="practicalTraining" label="Calidad de la formación práctica">
                <Select
                  value={formData?.practicalTraining || ""}
                  onChange={(e) => handleInputChange("practicalTraining", e.target.value)}
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="excelente">Excelente</option>
                  <option value="muy-bueno">Muy Bueno</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="pobre">Pobre</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Preparación para el Mercado Laboral</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="jobPreparation" label="¿Qué tan bien lo preparó el programa para el mercado laboral?">
                <Select
                  value={formData?.jobPreparation || ""}
                  onChange={(e) => handleInputChange("jobPreparation", e.target.value)}
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="excelente">Excelente</option>
                  <option value="muy-bueno">Muy Bueno</option>
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="pobre">Pobre</option>
                </Select>
              </FormField>

              <FormField id="skillsRelevance" label="Relevancia de las habilidades adquiridas">
                <Select
                  value={formData?.skillsRelevance || ""}
                  onChange={(e) => handleInputChange("skillsRelevance", e.target.value)}
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="muy-relevante">Muy Relevante</option>
                  <option value="relevante">Relevante</option>
                  <option value="moderadamente-relevante">Moderadamente Relevante</option>
                  <option value="poco-relevante">Poco Relevante</option>
                  <option value="no-relevante">No Relevante</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Comentarios y Sugerencias</h3>
            <FormField id="comments" label="Comentarios adicionales">
              <Textarea
                id="comments"
                value={formData?.comments || ""}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                rows={4}
                placeholder="Comparta sus comentarios, sugerencias o experiencias sobre el programa"
              />
            </FormField>
          </div>
        </div>
      </form>
    </ModalContainer>
  )
}
