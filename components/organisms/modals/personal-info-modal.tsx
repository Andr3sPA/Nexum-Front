"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

import { logger } from "@/lib/logging"

interface PersonalInfoData {
  maritalStatus: string
  children: string
  socioeconomicLevel: string
  address: string
  country: string
  department: string
  city: string
  landlinePhone: string
  cellPhone: string
  whatsapp: string
  email: string
  whatsappAuthorization: string
  graduationDate: string
  lastUpdateDate?: string
}

interface PersonalInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PersonalInfoData) => void
  initialData: PersonalInfoData
}

export default function PersonalInfoModal({ isOpen, onClose, onSave, initialData }: PersonalInfoModalProps) {
  const [formData, setFormData] = useState<PersonalInfoData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when modal opens or initial data changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
    }
  }, [isOpen, initialData])

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return // Prevent double submission
    
    setIsSubmitting(true)
  
    try {
      await onSave({ ...formData, lastUpdateDate: new Date().toISOString().split('T')[0] })
      onClose()
    } catch (error) {
      logger.error('Error saving data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSave, onClose, isSubmitting])

  // Memoized input change handler
  const handleInputChange = useCallback((field: keyof PersonalInfoData, value: string) => {
    setFormData((prev: PersonalInfoData) => ({ ...prev, [field]: value }))
  }, [])

  // Memoized select options to prevent re-renders
  const maritalStatusOptions = useMemo(() => [
    { value: "SINGLE", label: "Soltero(a)" },
    { value: "MARRIED", label: "Casado(a)" },
    { value: "FREE_UNION", label: "Unión Libre" },
    { value: "DIVORCED", label: "Divorciado(a)" }
  ], [])

  const socioeconomicOptions = useMemo(() => [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" }
  ], [])

  const whatsappOptions = useMemo(() => [
    { value: "Sí", label: "Sí" },
    { value: "No", label: "No" }
  ], [])

  // Memoized form fields to prevent unnecessary re-renders
  const formFields = useMemo(() => [
    {
      id: "maritalStatus",
      label: "Estado Civil",
      type: "select" as const,
      options: maritalStatusOptions,
      value: formData.maritalStatus
    },
    {
      id: "children",
      label: "Número de Hijos",
      type: "number" as const,
      value: formData.children
    },
    {
      id: "socioeconomicLevel",
      label: "Estrato Socioeconómico",
      type: "select" as const,
      options: socioeconomicOptions,
      value: formData.socioeconomicLevel
    },
    {
      id: "address",
      label: "Dirección",
      type: "text" as const,
      value: formData.address
    },
    {
      id: "country",
      label: "País",
      type: "text" as const,
      value: formData.country
    },
    {
      id: "department",
      label: "Departamento",
      type: "text" as const,
      value: formData.department
    },
    {
      id: "city",
      label: "Ciudad",
      type: "text" as const,
      value: formData.city
    },
    {
      id: "landlinePhone",
      label: "Teléfono Fijo",
      type: "text" as const,
      value: formData.landlinePhone
    },
    {
      id: "cellPhone",
      label: "Celular",
      type: "text" as const,
      value: formData.cellPhone
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      type: "text" as const,
      value: formData.whatsapp
    },
    {
      id: "whatsappAuthorization",
      label: "Autoriza WhatsApp de la U",
      type: "select" as const,
      options: whatsappOptions,
      value: formData.whatsappAuthorization
    },
    {
      id: "graduationDate",
      label: "Fecha de Egreso",
      type: "date" as const,
      value: formData.graduationDate
    }
  ], [formData, maritalStatusOptions, socioeconomicOptions, whatsappOptions])

  // Memoized render field function
  const renderField = useCallback((field: typeof formFields[0]) => {
    const { id, label, type, value, options } = field

    if (type === "select") {
      return (
        <FormField key={id} id={id} label={label}>
          <Select value={value} onValueChange={(val) => handleInputChange(id as keyof PersonalInfoData, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )
    }

    return (
      <FormField key={id} id={id} label={label}>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => handleInputChange(id as keyof PersonalInfoData, e.target.value)}
        />
      </FormField>
    )
  }, [handleInputChange])

  return (
    <ModalContainer title="Editar Información Personal" isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map(renderField)}
        </div>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}

