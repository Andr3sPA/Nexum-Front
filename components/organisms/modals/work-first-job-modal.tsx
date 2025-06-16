"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

import { logger } from "@/lib/logging"

interface FirstJobData {
  company: string
  position: string
  startDate: string
  endDate: string
  sector: string
  contractType: string
  salary: string
  city: string
  country: string
  companyName: string
  relatedToCareer: string
  timeToFirstJob: string
  salaryRange: string
  area: string
  companyType: string
}

interface FirstJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FirstJobData) => void
  initialData: FirstJobData
}

export default function FirstJobModal({ isOpen, onClose, onSave, initialData }: FirstJobModalProps) {
  const [formData, setFormData] = useState<FirstJobData>(initialData)
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

  const handleInputChange = (field: keyof FirstJobData, value: string) => {
    setFormData((prev: FirstJobData) => ({ ...prev, [field]: value }))
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
            />
          </FormField>

          <FormField id="country" label="País">
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </FormField>

          <FormField id="position" label="Cargo">
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
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

          <FormField id="timeToFirstJob" label="Tiempo promedio primer empleo">
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

          <FormField id="salaryRange" label="Rango salarial primer empleo (SMLV)">
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
                <SelectItem value="desarrollo">Desarrollo de Software</SelectItem>
                <SelectItem value="analisis">Análisis de Datos</SelectItem>
                <SelectItem value="redes">Redes y Comunicaciones</SelectItem>
                <SelectItem value="seguridad">Seguridad Informática</SelectItem>
                <SelectItem value="soporte">Soporte Técnico</SelectItem>
                {/* TODO: Get areas from backend */}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="companyType" label="Tipo de empresa">
            <Input
              id="companyType"
              value={formData.companyType}
              onChange={(e) => handleInputChange("companyType", e.target.value)}
            />
          </FormField>
        </div>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
