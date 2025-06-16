"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

import { logger } from "@/lib/logging"

interface AcademicInfoData {
  graduationYear: string
  program: string
  studyPlan: string
  role: string
}

interface AcademicInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AcademicInfoData) => void
  initialData: AcademicInfoData
}

export default function AcademicInfoModal({ isOpen, onClose, onSave, initialData }: AcademicInfoModalProps) {
  const [formData, setFormData] = useState<AcademicInfoData>(initialData)
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

  const handleInputChange = (field: keyof AcademicInfoData, value: string) => {
    setFormData((prev: AcademicInfoData) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer title="Editar Información Académica" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="graduationYear" label="Año de Graduación">
            <Input
              id="graduationYear"
              type="number"
              value={formData.graduationYear}
              onChange={(e) => handleInputChange("graduationYear", e.target.value)}
            />
          </FormField>

          <FormField id="program" label="Programa Cursado en la UdeA">
            <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingenieria-sistemas">Ingeniería de Sistemas</SelectItem>
                <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                <SelectItem value="medicina">Medicina</SelectItem>
                <SelectItem value="derecho">Derecho</SelectItem>
                <SelectItem value="administracion">Administración</SelectItem>
                {/* TODO: Get programs from backend */}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="studyPlan" label="Plan de Estudios">
            <Select value={formData.studyPlan} onValueChange={(value) => handleInputChange("studyPlan", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plan-2020">Plan 2020</SelectItem>
                <SelectItem value="plan-2018">Plan 2018</SelectItem>
                <SelectItem value="plan-2015">Plan 2015</SelectItem>
                {/* TODO: Get study plans from backend */}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="role" label="Durante su formación fue">
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auxiliar-administrativo">Auxiliar administrativo</SelectItem>
                <SelectItem value="monitor">Monitor</SelectItem>
                <SelectItem value="auxiliar-programacion">Auxiliar de Programación</SelectItem>
                <SelectItem value="joven-investigador">Joven investigador</SelectItem>
                <SelectItem value="ninguno">Ninguno de los anteriores</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
