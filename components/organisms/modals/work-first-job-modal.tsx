"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { Label } from "@/components/atoms/label"
import { Switch } from "@/components/atoms/switch"

import { logger } from "@/lib/logging"
import { SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service"

interface WorkFirstJobData {
  companyName: string
  country: string
  position: string
  relatedToProgram: boolean
  salaryRangeId: number
  jobDelayId: number
  jobAreaId: number
  institutionTypeId: number
  alsoCurrentJob: boolean
}

interface WorkFirstJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: WorkFirstJobData) => void
  initialData?: WorkFirstJobData | null
  salaryRanges: SalaryRangeResponse[]
  jobDelays: Array<{ id: number; label: string }>
  jobAreas: Array<{ id: number; name: string }>
  institutionTypes: Array<{ id: number; name: string }>
}

// Default values for the form
const defaultFormData: WorkFirstJobData = {
  companyName: "",
  country: "",
  position: "",
  relatedToProgram: false,
  salaryRangeId: 0,
  jobDelayId: 0,
  jobAreaId: 0,
  institutionTypeId: 0,
  alsoCurrentJob: false
}

export function WorkFirstJobModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  salaryRanges,
  jobDelays,
  jobAreas,
  institutionTypes
}: WorkFirstJobModalProps) {
  const [formData, setFormData] = useState<WorkFirstJobData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Use initialData if it exists, otherwise use default values
    setFormData(initialData || defaultFormData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      onSave(formData)
    } catch (error) {
      logger.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof WorkFirstJobData, value: string | boolean | number) => {
    setFormData((prev: WorkFirstJobData) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer 
      title="Editar Primer Trabajo" 
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="companyName" label="Nombre de la Empresa">
            <Input
              id="companyName"
              value={formData?.companyName || ""}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Ingrese el nombre de la empresa"
              required
            />
          </FormField>

          <FormField id="country" label="País">
            <Input
              id="country"
              value={formData?.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Ingrese el país"
              required
            />
          </FormField>

          <FormField id="position" label="Cargo">
            <Input
              id="position"
              value={formData?.position || ""}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="Ingrese su cargo"
              required
            />
          </FormField>

          <FormField id="salaryRangeId" label="Rango Salarial">
            <Select
              value={formData?.salaryRangeId || ""}
              onChange={(e) => handleInputChange("salaryRangeId", parseInt(e.target.value))}
              required
            >
              <option value="">Seleccionar rango salarial</option>
              {salaryRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.salary}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="jobDelayId" label="Tiempo Promedio Trabajado">
            <Select
              value={formData?.jobDelayId || ""}
              onChange={(e) => handleInputChange("jobDelayId", parseInt(e.target.value))}
              required
            >
              <option value="">Seleccionar tiempo promedio trabajado</option>
              {jobDelays.map((delay) => (
                <option key={delay.id} value={delay.id}>
                  {delay.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="jobAreaId" label="Área de Trabajo">
            <Select
              value={formData?.jobAreaId || ""}
              onChange={(e) => handleInputChange("jobAreaId", parseInt(e.target.value))}
              required
            >
              <option value="">Seleccionar área de trabajo</option>
              {jobAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="institutionTypeId" label="Tipo de Institución">
            <Select
              value={formData?.institutionTypeId || ""}
              onChange={(e) => handleInputChange("institutionTypeId", parseInt(e.target.value))}
              required
            >
              <option value="">Seleccionar tipo de institución</option>
              {institutionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="relatedToProgram"
              checked={formData?.relatedToProgram || false}
              onCheckedChange={(checked) => handleInputChange("relatedToProgram", checked)}
            />
            <Label htmlFor="relatedToProgram" className="text-sm font-medium">
              El trabajo estaba relacionado con el programa de estudio
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="alsoCurrentJob"
              checked={formData?.alsoCurrentJob || false}
              onCheckedChange={(checked) => handleInputChange("alsoCurrentJob", checked)}
            />
            <Label htmlFor="alsoCurrentJob" className="text-sm font-medium">
              Este también es mi trabajo actual
            </Label>
          </div>
        </div>
      </div>
    </ModalContainer>
  )
}
