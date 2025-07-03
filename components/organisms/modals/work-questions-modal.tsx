"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"

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
  initialData: WorkQuestionsData
}

export function WorkQuestionsModal({ isOpen, onClose, onSave, initialData }: WorkQuestionsModalProps) {
  const [formData, setFormData] = useState<WorkQuestionsData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFormData(initialData)
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
    <ModalContainer title="Editar Preguntas Laborales" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="profiles" label="Perfiles en los que se ha desempeñado">
          <Textarea
            id="profiles"
            value={formData.profiles || ""}
            onChange={(e) => handleInputChange("profiles", e.target.value)}
            maxLength={200}
            placeholder="Ej: Desarrollador Full Stack, Analista de Sistemas..."
          />
        </FormField>

        <FormField id="formationRating" label="El perfil de formación ofrecido por el programa para su desarrollo profesional y laboral, ha sido adecuado? (califique de 1 a 5)">
          <Select
            value={formData.formationRating}
            onValueChange={(value) => handleInputChange("formationRating", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="space-y-2">
          <Label>
            De acuerdo con el proyecto formativo que cursó en el Programa, las siguientes competencias han sido
            adecuadas para su desarrollo profesional y laboral
          </Label>
          <MultiSelect
            options={competencyOptions}
            selected={formData.competencies || []}
            onChange={handleCompetencyChange}
            placeholder="Seleccionar competencias..."
          />
        </div>

        <FormField id="question1" label="Pregunta 1">
          <Textarea
            id="question1"
            value={formData.question1}
            onChange={(e) => handleInputChange("question1", e.target.value)}
            rows={3}
          />
        </FormField>

        <FormField id="question2" label="Pregunta 2">
          <Textarea
            id="question2"
            value={formData.question2}
            onChange={(e) => handleInputChange("question2", e.target.value)}
            rows={3}
          />
        </FormField>

        <FormField id="question3" label="Pregunta 3">
          <Textarea
            id="question3"
            value={formData.question3}
            onChange={(e) => handleInputChange("question3", e.target.value)}
            rows={3}
          />
        </FormField>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
