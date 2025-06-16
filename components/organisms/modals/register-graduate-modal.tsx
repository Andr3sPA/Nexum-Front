"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ModalContainer } from "@/components/organisms/modal-container"
import { ROUTES } from "@/lib/routes"
import { logger } from "@/lib/logging"

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
    <ModalContainer title="Registrar Nuevo Egresado" isOpen={open} onClose={handleClose} maxWidth="max-w-4xl">
      <DialogDescription>
        Complete la información básica del egresado. Después será redirigido para completar el perfil completo.
      </DialogDescription>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modal-email">Correo Electrónico *</Label>
            <Input
              id="modal-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-idType">Tipo de Identificación *</Label>
            <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                <SelectItem value="passport">Pasaporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-idNumber">Número de Identificación *</Label>
            <Input
              id="modal-idNumber"
              value={formData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-firstName">Primer Nombre *</Label>
            <Input
              id="modal-firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-secondName">Segundo Nombre</Label>
            <Input
              id="modal-secondName"
              value={formData.secondName}
              onChange={(e) => handleInputChange("secondName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-firstLastName">Primer Apellido *</Label>
            <Input
              id="modal-firstLastName"
              value={formData.firstLastName}
              onChange={(e) => handleInputChange("firstLastName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-secondLastName">Segundo Apellido</Label>
            <Input
              id="modal-secondLastName"
              value={formData.secondLastName}
              onChange={(e) => handleInputChange("secondLastName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-birthDate">Fecha de Nacimiento *</Label>
            <Input
              id="modal-birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-gender">Género *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hombre">Hombre</SelectItem>
                <SelectItem value="mujer">Mujer</SelectItem>
                <SelectItem value="no-binario">No binario</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-password">Contraseña Temporal *</Label>
            <Input
              id="modal-password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-confirmPassword">Confirmar Contraseña *</Label>
            <Input
              id="modal-confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" className="udea-primary" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar y Completar Perfil"}
          </Button>
        </DialogFooter>
      </form>
    </ModalContainer>
  )
}