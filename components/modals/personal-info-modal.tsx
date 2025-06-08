"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { sanitizeInput, validateEmail, validatePhone } from "@/lib/security"

interface PersonalInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

// Colombian cities data
const COLOMBIAN_CITIES = [
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué",
  "Pasto", "Manizales", "Neiva", "Soledad", "Armenia", "Villavicencio", "Soacha", "Valledupar", "Montería", "Itagüí",
  "Palmira", "Buenaventura", "Floridablanca", "Sincelejo", "Popayán", "Barrancas", "Dos Quebradas", "Tuluá", "Envigado",
  "Cartago", "Girardot", "Bello", "Facatativá", "Malambo", "Sogamoso", "Zipaquirá", "Chía", "Duitama", "Girón", "Riohacha"
]

// Colombian departments
const COLOMBIAN_DEPARTMENTS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca",
  "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta",
  "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander",
  "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"
]

// Countries list
const COUNTRIES = [
  "Colombia", "Argentina", "Brasil", "Chile", "Ecuador", "Perú", "Venezuela", "Bolivia", "Paraguay", "Uruguay",
  "Estados Unidos", "Canadá", "México", "España", "Francia", "Alemania", "Italia", "Reino Unido", "Australia", "Japón"
]

export default function PersonalInfoModal({ isOpen, onClose, onSave, initialData }: PersonalInfoModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))

    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Correo electrónico inválido"
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Número de teléfono inválido"
    }

    if (formData.whatsapp && !validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = "Número de WhatsApp inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Sanitize all text inputs
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        whatsapp: sanitizeInput(formData.whatsapp),
        address: sanitizeInput(formData.address),
        city: sanitizeInput(formData.city),
        country: sanitizeInput(formData.country),
        department: sanitizeInput(formData.department),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(sanitizedData)
    } catch (error) {
      console.error("Error saving personal info:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalContainer title="Editar Información Personal" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="name" label="Nombre Completo" error={errors.name}>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            maxLength={100}
            required
          />
        </FormField>

        <FormField id="email" label="Correo Electrónico" error={errors.email}>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            maxLength={100}
            required
          />
        </FormField>

        <FormField id="phone" label="Número de Celular" error={errors.phone}>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            maxLength={20}
          />
        </FormField>

        <FormField id="whatsapp" label="Número de Celular asociado con WhatsApp" error={errors.whatsapp}>
          <Input
            id="whatsapp"
            type="tel"
            value={formData.whatsapp || ""}
            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
            maxLength={20}
          />
        </FormField>

        <FormField id="address" label="Dirección">
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            maxLength={200}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField id="country" label="País">
            <Select
              value={formData.country || ""}
              onValueChange={(value) => handleInputChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="department" label="Departamento">
            <Select
              value={formData.department || ""}
              onValueChange={(value) => handleInputChange("department", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar departamento" />
              </SelectTrigger>
              <SelectContent>
                {COLOMBIAN_DEPARTMENTS.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="city" label="Ciudad">
            <Select
              value={formData.city || ""}
              onValueChange={(value) => handleInputChange("city", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ciudad" />
              </SelectTrigger>
              <SelectContent>
                {COLOMBIAN_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField id="authorizeWhatsapp" label="¿Autoriza a ser parte de WhatsApp de la Universidad?">
          <Select
            value={formData.authorizeWhatsapp || ""}
            onValueChange={(value) => handleInputChange("authorizeWhatsapp", value)}
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

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
