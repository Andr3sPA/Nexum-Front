"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function EvaluationModal({ isOpen, onClose, onSave, initialData }: EvaluationModalProps) {
  const [formData, setFormData] = useState(initialData)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer title="Editar Evaluación del Programa" isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="strengths"
          label="¿Cuáles crees que son las fortalezas de la formación en el programa de egreso?"
        >
          <Textarea
            id="strengths"
            value={formData.strengths}
            onChange={(e) => handleInputChange("strengths", e.target.value)}
            rows={4}
          />
        </FormField>

        <FormField
          id="weaknesses"
          label="¿Cuáles crees que son las debilidades de la formación en el programa de egreso?"
        >
          <Textarea
            id="weaknesses"
            value={formData.weaknesses}
            onChange={(e) => handleInputChange("weaknesses", e.target.value)}
            rows={4}
          />
        </FormField>

        <FormField
          id="additionalCompetencies"
          label="¿Cuáles competencias o cursos consideras deberían adicionarse a la formación?"
        >
          <Textarea
            id="additionalCompetencies"
            value={formData.additionalCompetencies}
            onChange={(e) => handleInputChange("additionalCompetencies", e.target.value)}
            rows={4}
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
