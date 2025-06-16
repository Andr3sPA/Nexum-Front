"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

import { logger } from "@/lib/logging"

interface WorkQuestionsData {
  currentlyWorking: string
  workingInField: string
  timeToFindJob: string
  jobSatisfaction: string
  salaryRange: string
  profiles: string
  formationRating: string
  competencies: string
  question1: string
  question2: string
  question3: string
}

interface WorkQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: WorkQuestionsData) => void
  initialData: WorkQuestionsData
}

export default function WorkQuestionsModal({ isOpen, onClose, onSave, initialData }: WorkQuestionsModalProps) {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: WorkQuestionsData) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer title="Editar Preguntas Laborales" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="profiles" label="Perfiles en los que se ha desempeñado">
          <Select value={formData.profiles} onValueChange={(value) => handleInputChange("profiles", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desarrollador">Desarrollador</SelectItem>
              <SelectItem value="analista">Analista</SelectItem>
              <SelectItem value="arquitecto">Arquitecto de Software</SelectItem>
              <SelectItem value="gerente">Gerente de Proyectos</SelectItem>
              <SelectItem value="consultor">Consultor</SelectItem>
              {/* TODO: Get profiles from backend */}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="formationRating" label="El perfil de formación ha sido adecuado (1-5)">
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

        <FormField id="competencies" label="Competencias adecuadas">
          <Input
            id="competencies"
            value={formData.competencies}
            onChange={(e) => handleInputChange("competencies", e.target.value)}
          />
        </FormField>

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
