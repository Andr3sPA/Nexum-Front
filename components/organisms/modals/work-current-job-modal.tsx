"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/molecules/dialog"
import { Input } from "@/components/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { Checkbox } from "@/components/atoms/checkbox"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { AlertCircle } from "lucide-react"
import { 
  SalaryRangeResponse,
  JobDelayResponse,
  JobAreaResponse,
  JobInstitutionTypeResponse
} from "@/lib/services/catalog"

interface WorkCurrentJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: CurrentJobFormData) => void
  initialData: CurrentJobFormData
  salaryRanges: SalaryRangeResponse[]
  jobDelays: JobDelayResponse[]
  jobAreas: JobAreaResponse[]
  institutionTypes: JobInstitutionTypeResponse[]
  hasAcademicInfo: boolean
  hasFirstJob: boolean
}

interface CurrentJobFormData {
  companyName: string
  country: string
  position: string
  relatedToCareer: string
  salaryRangeId: string
  jobDelayId: string
  jobAreaId: string
  institutionTypeId: string
  alsoFirstJob: boolean
}

export function WorkCurrentJobModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  salaryRanges,
  jobDelays,
  jobAreas,
  institutionTypes,
  hasAcademicInfo,
  hasFirstJob
}: WorkCurrentJobModalProps) {
  const [formData, setFormData] = useState<CurrentJobFormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      onSave(formData)
    } catch (error) {
      console.error("Error saving current job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CurrentJobFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Ensure all select values are strings
  const safeValue = (value: any): string => {
    return value ? String(value) : ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Trabajo Actual</DialogTitle>
        </DialogHeader>

        {!hasAcademicInfo && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para mostrar opciones específicas de tu carrera, registra tu información académica en la pestaña "Información Académica".
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField id="companyName" label="Nombre de la empresa">
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Ingrese el nombre de la empresa"
              />
            </FormField>

            <FormField id="position" label="Cargo">
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Ingrese el cargo"
              />
            </FormField>

            <FormField id="country" label="País">
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Ingrese el país"
              />
            </FormField>

            <FormField id="relatedToCareer" label="Cargo relacionado con la carrera">
              <Select
                value={safeValue(formData.relatedToCareer)}
                onChange={e => handleInputChange("relatedToCareer", e.target.value)}
              >
                <option value="" disabled>Seleccionar</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </Select>
            </FormField>

            <FormField id="salaryRange" label="Rango salarial actual (SMLV)">
              <Select
                value={safeValue(formData.salaryRangeId)}
                onChange={e => handleInputChange("salaryRangeId", e.target.value)}
              >
                <option value="" disabled>Seleccionar</option>
                {salaryRanges.map((range) => (
                  <option key={range.id} value={String(range.id)}>
                    {range.salary}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField id="timeInCompany" label="Tiempo en la empresa">
              <Select
                value={safeValue(formData.jobDelayId)}
                onChange={e => handleInputChange("jobDelayId", e.target.value)}
              >
                <option value="" disabled>Seleccionar</option>
                {jobDelays.map((delay) => (
                  <option key={delay.id} value={String(delay.id)}>
                    {delay.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField id="area" label="Área de empleo actual">
              <Select
                value={safeValue(formData.jobAreaId)}
                onChange={e => handleInputChange("jobAreaId", e.target.value)}
              >
                <option value="" disabled>Seleccionar</option>
                {jobAreas.length > 0 ? (
                  jobAreas.map((area) => (
                    <option key={area.id} value={String(area.id)}>
                      {area.name}
                    </option>
                  ))
                ) : (
                  <option value="no-areas" disabled>
                    {hasAcademicInfo ? "No hay áreas disponibles" : "Registra tu información académica"}
                  </option>
                )}
              </Select>
            </FormField>

            <FormField id="companyType" label="Tipo de empresa">
              <Select
                value={safeValue(formData.institutionTypeId)}
                onChange={e => handleInputChange("institutionTypeId", e.target.value)}
              >
                <option value="" disabled>Seleccionar</option>
                {institutionTypes.length > 0 ? (
                  institutionTypes.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name}
                    </option>
                  ))
                ) : (
                  <option value="no-types" disabled>
                    {hasAcademicInfo ? "No hay tipos disponibles" : "Registra tu información académica"}
                  </option>
                )}
              </Select>
            </FormField>

            <FormField id="alsoFirstJob" label="También es mi primer trabajo">
              <Checkbox
                id="alsoFirstJob"
                checked={formData.alsoFirstJob}
                onCheckedChange={(checked) => handleInputChange("alsoFirstJob", checked)}
              />
            </FormField>
          </div>

          <ModalActions
            onCancel={onClose}
            isSubmitting={isSubmitting}
            submitText="Guardar"
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
