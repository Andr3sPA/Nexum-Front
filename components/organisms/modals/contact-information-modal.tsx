"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Switch } from "@/components/atoms/switch"
import { ModalContainer } from "@/components/organisms/modal-container"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FormSection } from "@/components/atoms/form-section"
import { useProfile } from "@/contexts/profile-context"
import { ContactInformationResponse } from "@/lib/services/profile/contact-information.service"
import { logger } from "@/lib/logging"
import { MapPin, Phone, Mail, Shield } from "lucide-react"

interface ContactInformationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: ContactFormData) => void
  contactData?: ContactInformationResponse | null
}

interface ContactFormData {
  address: string
  country: string
  state: string
  city: string
  landline: string
  mobile: string
  email: string
  academicEmail: string
  whatsappAuthorization: boolean
}

// Default values for the form
const defaultFormData: ContactFormData = {
  address: "",
  country: "",
  state: "",
  city: "",
  landline: "",
  mobile: "",
  email: "",
  academicEmail: "",
  whatsappAuthorization: false,
}

export function ContactInformationModal({
  isOpen,
  onClose,
  onSave,
  contactData
}: ContactInformationModalProps) {
  const { getUserId } = useProfile()
  const [formData, setFormData] = useState<ContactFormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (contactData) {
      setFormData({
        address: contactData.address || "",
        country: contactData.country || "",
        state: contactData.state || "",
        city: contactData.city || "",
        landline: contactData.landline || "",
        mobile: contactData.mobile || "",
        email: contactData.email || "",
        academicEmail: contactData.academicEmail || "",
        whatsappAuthorization: contactData.whatsappAuthorization === true,
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [contactData])

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    const userId = getUserId()
    if (!userId) {
      logger.error("No user ID found")
      return
    }

    try {
      setIsLoading(true)

      // Pass form data to parent component
      onSave(formData)
    } catch (error) {
      logger.error("Error saving contact information:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalContainer 
      title={contactData ? "Editar Información de Contacto" : "Agregar Información de Contacto"}
      icon={MapPin}
      subtitle="Datos de contacto y ubicación"
      color="blue"
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-4xl"
      onSubmit={handleSave}
      isSubmitting={isLoading}
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isLoading} />
      }
    >
      <div className="space-y-4">
        <FormSection
          icon={MapPin}
          title="Información de Ubicación"
          description="Datos de dirección y ubicación geográfica"
          color="blue"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ingrese la dirección"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData?.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Ingrese el país"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Departamento/Estado</Label>
              <Input
                id="state"
                value={formData?.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Ingrese el departamento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData?.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Ingrese la ciudad"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Phone}
          title="Información de Contacto"
          description="Números telefónicos y correos electrónicos"
          color="green"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landline">Teléfono Fijo</Label>
              <Input
                id="landline"
                value={formData?.landline || ""}
                onChange={(e) => handleInputChange("landline", e.target.value)}
                placeholder="Ingrese el teléfono fijo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cellphone">Celular</Label>
              <Input
                id="cellphone"
                value={formData?.mobile || ""}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="Ingrese el número celular"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Ingrese el correo electrónico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicEmail">Correo Académico</Label>
              <Input
                id="academicEmail"
                type="email"
                value={formData?.academicEmail || ""}
                onChange={(e) => handleInputChange("academicEmail", e.target.value)}
                placeholder="Ingrese el correo académico"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Shield}
          title="Autorizaciones"
          description="Permisos para comunicaciones"
          color="purple"
        >
          <div className="flex items-center space-x-3">
            <Switch
              id="whatsappAuthorization"
              checked={formData?.whatsappAuthorization || false}
              onCheckedChange={(checked) => handleInputChange("whatsappAuthorization", checked)}
            />
            <Label htmlFor="whatsappAuthorization" className="text-sm">
              Autorizo el uso de WhatsApp para comunicaciones
            </Label>
          </div>
        </FormSection>
      </div>
    </ModalContainer>
  )
} 