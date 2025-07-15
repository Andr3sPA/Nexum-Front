"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { User, FileText, MapPin, Phone, Calendar } from "lucide-react"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { Textarea } from "@/components/atoms/textarea"
import { FormSection } from "@/components/atoms/form-section"

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
  firstName?: string
  secondName?: string
  firstLastName?: string
  secondLastName?: string
  birthDate?: string
  gender?: string
  documentType?: string
  documentNumber?: string
  additionalInfo?: string
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

  return (
    <ModalContainer 
      title="Información Personal" 
      subtitle="Complete sus datos personales y de contacto"
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-5xl"
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection 
          title="Información Básica"
          description="Datos personales fundamentales"
          icon={User}
          color="blue"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField id="firstName" label="Primer Nombre">
              <Input
                id="firstName"
                value={formData?.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Ingrese el primer nombre"
                required
              />
            </FormField>

            <FormField id="secondName" label="Segundo Nombre">
              <Input
                id="secondName"
                value={formData?.secondName || ""}
                onChange={(e) => handleInputChange("secondName", e.target.value)}
                placeholder="Ingrese el segundo nombre (opcional)"
              />
            </FormField>

            <FormField id="firstLastName" label="Primer Apellido">
              <Input
                id="firstLastName"
                value={formData?.firstLastName || ""}
                onChange={(e) => handleInputChange("firstLastName", e.target.value)}
                placeholder="Ingrese el primer apellido"
                required
              />
            </FormField>

            <FormField id="secondLastName" label="Segundo Apellido">
              <Input
                id="secondLastName"
                value={formData?.secondLastName || ""}
                onChange={(e) => handleInputChange("secondLastName", e.target.value)}
                placeholder="Ingrese el segundo apellido (opcional)"
              />
            </FormField>

            <FormField id="birthDate" label="Fecha de Nacimiento">
              <Input
                id="birthDate"
                type="date"
                value={formData?.birthDate || ""}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                required
              />
            </FormField>

            <FormField id="gender" label="Género">
              <Select
                value={formData?.gender || ""}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="">Seleccionar género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decir">Prefiero no decir</option>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Información de Documento"
          description="Datos de identificación oficial"
          icon={FileText}
          color="green"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField id="documentType" label="Tipo de Documento">
              <Select
                value={formData?.documentType || ""}
                onChange={(e) => handleInputChange("documentType", e.target.value)}
                required
              >
                <option value="">Seleccionar tipo de documento</option>
                <option value="cc">Cédula de Ciudadanía</option>
                <option value="ce">Cédula de Extranjería</option>
                <option value="ti">Tarjeta de Identidad</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="otros">Otros</option>
              </Select>
            </FormField>

            <FormField id="documentNumber" label="Número de Documento">
              <Input
                id="documentNumber"
                value={formData?.documentNumber || ""}
                onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                placeholder="Ingrese el número de documento"
                required
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Información de Contacto"
          description="Datos de ubicación y comunicación"
          icon={Phone}
          color="purple"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField id="address" label="Dirección">
              <Input
                id="address"
                value={formData?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ingrese su dirección"
              />
            </FormField>

            <FormField id="country" label="País">
              <Input
                id="country"
                value={formData?.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Ingrese el país"
              />
            </FormField>

            <FormField id="department" label="Departamento">
              <Input
                id="department"
                value={formData?.department || ""}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="Ingrese el departamento"
              />
            </FormField>

            <FormField id="city" label="Ciudad">
              <Input
                id="city"
                value={formData?.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Ingrese la ciudad"
              />
            </FormField>

            <FormField id="landlinePhone" label="Teléfono Fijo">
              <Input
                id="landlinePhone"
                value={formData?.landlinePhone || ""}
                onChange={(e) => handleInputChange("landlinePhone", e.target.value)}
                placeholder="Ingrese el teléfono fijo"
              />
            </FormField>

            <FormField id="cellPhone" label="Celular">
              <Input
                id="cellPhone"
                value={formData?.cellPhone || ""}
                onChange={(e) => handleInputChange("cellPhone", e.target.value)}
                placeholder="Ingrese el número de celular"
              />
            </FormField>

            <FormField id="whatsapp" label="WhatsApp">
              <Input
                id="whatsapp"
                value={formData?.whatsapp || ""}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                placeholder="Ingrese el número de WhatsApp"
              />
            </FormField>

            <FormField id="whatsappAuthorization" label="Autoriza WhatsApp de la U">
              <Select
                value={formData?.whatsappAuthorization || ""}
                onChange={(e) => handleInputChange("whatsappAuthorization", e.target.value)}
              >
                <option value="">Seleccionar</option>
                {whatsappOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Información Académica"
          description="Datos relacionados con su formación"
          icon={Calendar}
          color="orange"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FormField id="maritalStatus" label="Estado Civil">
              <Select
                value={formData?.maritalStatus || ""}
                onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
              >
                <option value="">Seleccionar</option>
                {maritalStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField id="children" label="Número de Hijos">
              <Input
                id="children"
                type="number"
                min="0"
                value={formData?.children || ""}
                onChange={(e) => handleInputChange("children", e.target.value)}
                placeholder="Ingrese el número de hijos"
              />
            </FormField>

            <FormField id="socioeconomicLevel" label="Estrato Socioeconómico">
              <Select
                value={formData?.socioeconomicLevel || ""}
                onChange={(e) => handleInputChange("socioeconomicLevel", e.target.value)}
              >
                <option value="">Seleccionar</option>
                {socioeconomicOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField id="graduationDate" label="Fecha de Egreso">
              <Input
                id="graduationDate"
                type="date"
                value={formData?.graduationDate || ""}
                onChange={(e) => handleInputChange("graduationDate", e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Información Adicional"
          description="Comentarios o información complementaria"
          icon={MapPin}
          color="blue"
        >
          <FormField id="additionalInfo" label="Información adicional">
            <Textarea
              id="additionalInfo"
              value={formData?.additionalInfo || ""}
              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
              rows={4}
              placeholder="Agregue cualquier información adicional que considere relevante"
            />
          </FormField>
        </FormSection>
      </form>
    </ModalContainer>
  )
}

