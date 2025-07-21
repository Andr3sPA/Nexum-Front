"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Lightbulb, Link, FileText } from "lucide-react"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FormSection } from "@/components/atoms/form-section"

import { logger } from "@/lib/logging"
import { InnovationProcessRequest, InnovationProcessResponse } from "@/lib/services/profile/innovation-process.service"
import { InnovationProcessTypeResponse } from "@/lib/services/catalog/innovation-process-type.service"

interface InnovationProcessModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: InnovationProcessRequest) => void
  initialData?: InnovationProcessResponse
  innovationTypes?: InnovationProcessTypeResponse[]
}

// Default values for the form
const defaultFormData: InnovationProcessRequest = {
  userId: "",
  typeId: 0,
  name: "",
  description: "",
  link: "",
}

export default function InnovationProcessModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  innovationTypes = [] 
}: InnovationProcessModalProps) {
  const [formData, setFormData] = useState<InnovationProcessRequest>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        userId: "", // This should be set from context or props
        typeId: initialData.type.id,
        name: initialData.name,
        description: initialData.description || "",
        link: initialData.link || "",
      })
    } else if (isOpen) {
      setFormData(defaultFormData)
    }
  }, [isOpen, initialData])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      logger.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSave, onClose, isSubmitting])

  const handleInputChange = useCallback((field: keyof InnovationProcessRequest, value: any) => {
    setFormData((prev: InnovationProcessRequest) => ({ ...prev, [field]: value }))
  }, [])

  return (
    <ModalContainer 
      title="Proceso de Innovación" 
      subtitle="Configure la información de su proceso de innovación"
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl"
      actions={
        <ModalActions 
          onCancel={onClose} 
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      }
    >
      <div className="space-y-8">
        <FormSection 
          title="Información Básica"
          description="Datos principales del proceso de innovación"
          icon={Lightbulb}
          color="blue"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField id="name" label="Nombre del proceso">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ingrese el nombre del proceso"
                required
              />
            </FormField>

            <FormField id="typeId" label="Tipo de proceso">
              <Select
                value={formData.typeId.toString()}
                onChange={(e) => handleInputChange("typeId", parseInt(e.target.value))}
                required
              >
                <option value="">Seleccionar tipo</option>
                {innovationTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Descripción"
          description="Detalles adicionales del proceso"
          icon={FileText}
          color="green"
        >
          <FormField id="description" label="Descripción del proceso">
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              placeholder="Describa el proceso de innovación, sus objetivos, metodología, etc."
            />
          </FormField>
        </FormSection>

        <FormSection 
          title="Enlaces y Recursos"
          description="Enlaces relacionados con el proceso"
          icon={Link}
          color="purple"
        >
          <FormField id="link" label="Enlace del proyecto">
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              placeholder="https://ejemplo.com/proyecto"
            />
          </FormField>
        </FormSection>
      </div>
    </ModalContainer>
  )
} 