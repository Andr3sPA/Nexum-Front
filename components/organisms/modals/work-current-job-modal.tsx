"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FormSection } from "@/components/atoms/form-section"
import { Label } from "@/components/atoms/label"
import { Switch } from "@/components/atoms/switch"

import { logger } from "@/lib/logging"
import { Building2, MapPin, Briefcase, DollarSign, Clock, Users, Building, CheckCircle } from "lucide-react"
import { SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service"

interface WorkCurrentJobData {
  companyName: string
  country: string
  position: string
  relatedToProgram: boolean
  salaryRangeId: number
  jobDelayId: number
  jobAreaId: number
  institutionTypeId: number
  alsoFirstJob: boolean
}

interface WorkCurrentJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: WorkCurrentJobData) => void
  initialData?: WorkCurrentJobData | null
  salaryRanges: SalaryRangeResponse[]
  jobDelays: Array<{ id: number; label: string }>
  jobAreas: Array<{ id: number; name: string }>
  institutionTypes: Array<{ id: number; name: string }>
}

// Default values for the form
const defaultFormData: WorkCurrentJobData = {
  companyName: "",
  country: "",
  position: "",
  relatedToProgram: false,
  salaryRangeId: 0,
  jobDelayId: 0,
  jobAreaId: 0,
  institutionTypeId: 0,
  alsoFirstJob: false
}

export function WorkCurrentJobModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  salaryRanges,
  jobDelays,
  jobAreas,
  institutionTypes
}: WorkCurrentJobModalProps) {
  const [formData, setFormData] = useState<WorkCurrentJobData>(defaultFormData)
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

  const handleInputChange = (field: keyof WorkCurrentJobData, value: string | boolean | number) => {
    setFormData((prev: WorkCurrentJobData) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer 
      title="Editar Trabajo Actual"
      icon={Building2}
      subtitle="Información del empleo actual"
      color="green"
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      }
    >
      <div className="space-y-4">
        <FormSection
          icon={Building2}
          title="Información de la Empresa"
          description="Datos básicos de la empresa y cargo"
          color="green"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          </div>
        </FormSection>

        <FormSection
          icon={DollarSign}
          title="Información Laboral"
          description="Detalles del empleo y compensación"
          color="blue"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        </FormSection>

        <FormSection
          icon={CheckCircle}
          title="Relaciones y Configuraciones"
          description="Configuraciones adicionales del empleo"
          color="purple"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="relatedToProgram"
                checked={formData?.relatedToProgram || false}
                onCheckedChange={(checked) => handleInputChange("relatedToProgram", checked)}
              />
              <Label htmlFor="relatedToProgram" className="text-sm font-medium">
                El trabajo está relacionado con el programa de estudio
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="alsoFirstJob"
                checked={formData?.alsoFirstJob || false}
                onCheckedChange={(checked) => handleInputChange("alsoFirstJob", checked)}
              />
              <Label htmlFor="alsoFirstJob" className="text-sm font-medium">
                Este también es mi primer trabajo
              </Label>
            </div>
          </div>
        </FormSection>
      </div>
    </ModalContainer>
  )
}
