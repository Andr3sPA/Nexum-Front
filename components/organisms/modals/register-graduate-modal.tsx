"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { DialogDescription, DialogFooter } from "@/components/molecules/dialog"
import { ROUTES } from "@/lib/routes"
import { logger } from "@/lib/logging"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

interface RegisterFormData {
  email: string
  idType: string
  idNumber: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  birthDate: string
  gender: string
  password: string
  confirmPassword: string
}

interface RegisterGraduateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RegisterGraduateModal({ open, onOpenChange }: RegisterGraduateModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    idType: "",
    idNumber: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement registration logic with backend
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Generate a temporary ID for the new graduate
      const graduateId = `grad_${Date.now()}`

      // Close modal and redirect to complete profile page
      onOpenChange(false)
      router.push(`${ROUTES.ADMIN.COMPLETE_PROFILE}?graduateId=${graduateId}&newUser=true`)
    } catch (error) {
      logger.error("Registration failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      email: "",
      idType: "",
      idNumber: "",
      firstName: "",
      secondName: "",
      firstLastName: "",
      secondLastName: "",
      birthDate: "",
      gender: "",
      password: "",
      confirmPassword: "",
    })
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <ModalContainer 
      title="Registro de Graduado" 
      isOpen={open} 
      onClose={handleClose} 
      maxWidth="max-w-4xl"
      actions={
        <ModalActions onCancel={handleClose} isSubmitting={isSubmitting} />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <FormField id="email" label="Correo Electrónico">
                <Input
                  id="email"
                  type="email"
                  value={formData?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ingrese el correo electrónico"
                  required
                />
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información de Documento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="documentType" label="Tipo de Documento">
                <Select
                  value={formData?.idType || ""}
                  onChange={(e) => handleInputChange("idType", e.target.value)}
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
                  value={formData?.idNumber || ""}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  placeholder="Ingrese el número de documento"
                  required
                />
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Académica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="program" label="Programa de Estudio">
                <Select
                  value={formData?.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  required
                >
                  <option value="">Seleccionar programa</option>
                  <option value="ingenieria-sistemas">Ingeniería de Sistemas</option>
                  <option value="ingenieria-informatica">Ingeniería Informática</option>
                  <option value="ciencias-computacion">Ciencias de la Computación</option>
                  <option value="tecnologia-sistemas">Tecnología en Sistemas</option>
                  <option value="otros">Otros</option>
                </Select>
              </FormField>

              <FormField id="graduationYear" label="Año de Graduación">
                <Input
                  id="graduationYear"
                  type="number"
                  min="1990"
                  max="2030"
                  value={formData?.birthDate || ""}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  placeholder="Ingrese el año de graduación"
                  required
                />
              </FormField>

              <FormField id="gpa" label="Promedio Académico">
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  value={formData?.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Ingrese el promedio académico"
                />
              </FormField>

              <FormField id="thesisTitle" label="Título de la Tesis/Proyecto">
                <Input
                  id="thesisTitle"
                  value={formData?.confirmPassword || ""}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Ingrese el título de la tesis o proyecto"
                />
              </FormField>
            </div>
          </div>
        </div>
      </form>
    </ModalContainer>
  )
}