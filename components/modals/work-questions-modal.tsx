"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { sanitizeInput } from "@/lib/security"

interface WorkQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function WorkQuestionsModal({ isOpen, onClose, onSave, initialData }: WorkQuestionsModalProps) {
  const [formData, setFormData] = useState(initialData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [competencyOptions, setCompetencyOptions] = useState<MultiSelectOption[]>([])

  useEffect(() => {
    setFormData(initialData || {})

    // TODO: Fetch competencies from backend based on user's program
    const mockCompetencies = [
      "Programación en múltiples lenguajes",
      "Análisis y diseño de sistemas",
      "Gestión de bases de datos",
      "Desarrollo web",
      "Seguridad informática",
      "Inteligencia artificial",
      "Gestión de proyectos",
      "Trabajo en equipo",
      "Comunicación efectiva",
      "Pensamiento crítico",
      "Resolución de problemas",
      "Liderazgo",
      "Metodologías ágiles",
      "Testing y calidad de software",
      "Arquitectura de software",
      "DevOps y CI/CD",
    ]

    setCompetencyOptions(
      mockCompetencies.map((comp) => ({
        value: comp,
        label: comp,
      })),
    )
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const sanitizedData = {
        ...formData,
        profiles: sanitizeInput(formData.profiles || ""),
        competencies: formData.competencies || [],
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(sanitizedData)
    } catch (error) {
      console.error("Error saving work questions:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleCompetencyChange = (competencies: string[]) => {
    setFormData((prev: any) => ({ ...prev, competencies }))
  }

  return (
    <ModalContainer title="Editar Preguntas Laborales" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="profiles" label="Perfiles en los que se ha desempeñado">
          <Input
            id="profiles"
            value={formData.profiles || ""}
            onChange={(e) => handleInputChange("profiles", e.target.value)}
            maxLength={200}
            placeholder="Ej: Desarrollador Full Stack, Analista de Sistemas..."
          />
        </FormField>

        <FormField
          id="formationRating"
          label="El perfil de formación ofrecido por el programa para su desarrollo profesional y laboral, ha sido adecuado? (califique de 1 a 5)"
        >
          <Select
            value={formData.formationRating || ""}
            onValueChange={(value) => handleInputChange("formationRating", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar calificación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muy inadecuado</SelectItem>
              <SelectItem value="2">2 - Inadecuado</SelectItem>
              <SelectItem value="3">3 - Regular</SelectItem>
              <SelectItem value="4">4 - Adecuado</SelectItem>
              <SelectItem value="5">5 - Muy adecuado</SelectItem>
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

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
