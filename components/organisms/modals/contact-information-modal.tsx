"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/molecules/dialog"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Switch } from "@/components/atoms/switch"
import { ModalActions } from "@/components/molecules/modal-actions"
import { ContactInformationResponse } from "@/lib/services/profile/contact-information.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { logger } from "@/lib/logging"

interface ContactInformationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: ContactFormData) => void
  contactData: ContactInformationResponse | null
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

export function ContactInformationModal({
  isOpen,
  onClose,
  onSave,
  contactData
}: ContactInformationModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    address: "",
    country: "",
    state: "",
    city: "",
    landline: "",
    mobile: "",
    email: "",
    academicEmail: "",
    whatsappAuthorization: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Get user from localStorage
  const user = LocalStorageService.getItem<any>("user")

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
      setFormData({
        address: "",
        country: "",
        state: "",
        city: "",
        landline: "",
        mobile: "",
        email: "",
        academicEmail: "",
        whatsappAuthorization: true,
      })
    }
  }, [contactData])

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!user?.id) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contactData ? "Editar Información de Contacto" : "Agregar Información de Contacto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Ingrese la dirección"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Ingrese el país"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Departamento/Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Ingrese el departamento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ingrese la ciudad"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landline">Teléfono Fijo</Label>
                <Input
                  id="landline"
                  value={formData.landline}
                  onChange={(e) => handleInputChange("landline", e.target.value)}
                  placeholder="Ingrese el teléfono fijo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cellphone">Celular</Label>
                <Input
                  id="cellphone"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Ingrese el número celular"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ingrese el correo electrónico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicEmail">Correo Académico</Label>
                <Input
                  id="academicEmail"
                  type="email"
                  value={formData.academicEmail}
                  onChange={(e) => handleInputChange("academicEmail", e.target.value)}
                  placeholder="Ingrese el correo académico"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="whatsappAuthorization"
                checked={formData.whatsappAuthorization}
                onCheckedChange={(checked) => handleInputChange("whatsappAuthorization", checked)}
              />
              <Label htmlFor="whatsappAuthorization">
                Autoriza WhatsApp de la Universidad
              </Label>
            </div>
          </div>

          <ModalActions
            onCancel={onClose}
            isSubmitting={isLoading}
            submitText={contactData ? "Actualizar" : "Guardar"}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
} 