"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { sanitizeInput } from "@/lib/security"

import { logger } from "@/lib/logging"

interface WorkFirstJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function WorkFirstJobModal({ isOpen, onClose, onSave, initialData }: WorkFirstJobModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [areas, setAreas] = useState<string[]>([])

  useEffect(() => {
    setFormData(initialData)
    // TODO: Fetch areas from backend based on user's program
    setAreas([
      "Desarrollo de Software",
      "Análisis de Datos",
      "Redes y Comunicaciones",
      "Seguridad Informática",
      "Soporte Técnico",
      "Inteligencia Artificial",
      "Bases de Datos",
      "Arquitectura de Software",
    ])
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Sanitize all input data
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = typeof formData[key] === "string" ? sanitizeInput(formData[key]) : formData[key]
        return acc
      }, {} as any)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(sanitizedData)
    } catch (error) {
      // Remove duplicate import
      // import { logger } from "@/lib/logging"
      
      logger.error("Error saving first job info:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer title="Editar Información Laboral Primer Empleo" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="companyName" label="Nombre de la empresa">
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              maxLength={100}
            />
          </FormField>

          <FormField id="country" label="País">
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              maxLength={50}
            />
          </FormField>

          <FormField id="position" label="Cargo">
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              maxLength={100}
            />
          </FormField>

          <FormField id="relatedToCareer" label="Cargo relacionado con la carrera">
            <Select
              value={formData.relatedToCareer}
              onValueChange={(value) => handleInputChange("relatedToCareer", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            id="timeToFirstJob"
            label="Tiempo promedio en el que obtuviste el primer empleo (Relacionado con la carrera)"
          >
            <Select
              value={formData.timeToFirstJob}
              onValueChange={(value) => handleInputChange("timeToFirstJob", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menos-6-meses">Menos de 6 meses</SelectItem>
                <SelectItem value="6-meses-1-año">Entre 6 meses a 1 año</SelectItem>
                <SelectItem value="1-2-años">Entre 1 y 2 años</SelectItem>
                <SelectItem value="2-3-años">Entre 2 y 3 años</SelectItem>
                <SelectItem value="nunca">Nunca he trabajado en nada relacionado</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="salaryRange" label="Rango salarial de su primer empleo (SMLV)">
            <Select value={formData.salaryRange} onValueChange={(value) => handleInputChange("salaryRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2">Entre 1 y 2</SelectItem>
                <SelectItem value="2-3">Entre 2 y 3</SelectItem>
                <SelectItem value="3-4">Entre 3 y 4</SelectItem>
                <SelectItem value="4-5">Entre 4 y 5</SelectItem>
                <SelectItem value="4-6">Entre 4 y 6</SelectItem>
                <SelectItem value="6-7">Entre 6 y 7</SelectItem>
                <SelectItem value="7-8">Entre 7 y 8</SelectItem>
                <SelectItem value="8-9">Entre 8 y 9</SelectItem>
                <SelectItem value="mas-9">Más de 9</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="area" label="Área de su primer empleo">
            <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="companyType" label="Tipo de empresa de su primer empleo">
            <Input
              id="companyType"
              value={formData.companyType}
              onChange={(e) => handleInputChange("companyType", e.target.value)}
              maxLength={100}
            />
          </FormField>
        </div>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
