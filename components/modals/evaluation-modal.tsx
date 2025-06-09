"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select"
import { sanitizeInput } from "@/lib/security"

import { logger } from "@/lib/logging"

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function EvaluationModal({ isOpen, onClose, onSave, initialData }: EvaluationModalProps) {
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
      "Machine Learning",
      "Análisis de datos",
      "UX/UI Design",
      "Ciberseguridad",
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
        strengths: sanitizeInput(formData.strengths || ""),
        weaknesses: sanitizeInput(formData.weaknesses || ""),
        question1: sanitizeInput(formData.question1 || ""),
        question2: sanitizeInput(formData.question2 || ""),
        question3: sanitizeInput(formData.question3 || ""),
        additionalCompetencies: formData.additionalCompetencies || [],
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(sanitizedData)
    } catch (error) {
      

      logger.error("Error saving evaluation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleCompetencyChange = (competencies: string[]) => {
    setFormData((prev: any) => ({ ...prev, additionalCompetencies: competencies }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="udea-primary-text">Editar Evaluación del Programa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="strengths">
              ¿Cuáles crees que son las fortalezas de la formación en el programa de egreso?
            </Label>
            <Textarea
              id="strengths"
              value={formData.strengths || ""}
              onChange={(e) => handleInputChange("strengths", e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe las fortalezas del programa..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weaknesses">
              ¿Cuáles crees que son las debilidades de la formación en el programa de egreso?
            </Label>
            <Textarea
              id="weaknesses"
              value={formData.weaknesses || ""}
              onChange={(e) => handleInputChange("weaknesses", e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe las debilidades del programa..."
            />
          </div>

          <div className="space-y-2">
            <Label>
              ¿Cuáles competencias o cursos que consideras deberían adicionarse a la formación en el programa de egreso?
            </Label>
            <MultiSelect
              options={competencyOptions}
              selected={formData.additionalCompetencies || []}
              onChange={handleCompetencyChange}
              placeholder="Seleccionar competencias..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question1">Pregunta 1</Label>
            <Textarea
              id="question1"
              value={formData.question1 || ""}
              onChange={(e) => handleInputChange("question1", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Respuesta a la pregunta 1..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question2">Pregunta 2</Label>
            <Textarea
              id="question2"
              value={formData.question2 || ""}
              onChange={(e) => handleInputChange("question2", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Respuesta a la pregunta 2..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question3">Pregunta 3</Label>
            <Textarea
              id="question3"
              value={formData.question3 || ""}
              onChange={(e) => handleInputChange("question3", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Respuesta a la pregunta 3..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="udea-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
