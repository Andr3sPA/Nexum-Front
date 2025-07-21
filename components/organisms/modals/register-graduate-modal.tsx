"use client"

import React, { useState, useEffect } from "react"
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
import { UserService, UserRequest } from "@/lib/services/profile/user.service"
import { IdentityDocumentTypeService, IdentityDocumentTypeResponse } from "@/lib/services/catalog/identity-document-type.service"

interface RegisterFormData {
  identityDocument: string
  idIdentityDocumentType: string
  name: string
  middleName: string
  lastname: string
  secondLastname: string
  gender: string
  birthdate: string
}

interface RegisterGraduateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (formData: RegisterFormData) => void
}

export default function RegisterGraduateModal({ open, onOpenChange, onSave }: RegisterGraduateModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    identityDocument: "",
    idIdentityDocumentType: "",
    name: "",
    middleName: "",
    lastname: "",
    secondLastname: "",
    gender: "",
    birthdate: "",
  })
  const [documentTypes, setDocumentTypes] = useState<IdentityDocumentTypeResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDocumentTypes = async () => {
      try {
        const types = await IdentityDocumentTypeService.getAll()
        setDocumentTypes(types)
      } catch (error) {
        logger.error("Error loading document types:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      loadDocumentTypes()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave({
        ...formData,
        birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : "",
      })
      onOpenChange(false)
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
      identityDocument: "",
      idIdentityDocumentType: "",
      name: "",
      middleName: "",
      lastname: "",
      secondLastname: "",
      gender: "",
      birthdate: "",
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
      onSubmit={handleSubmit}
    >
      <form className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="name" label="Primer Nombre">
                <Input
                  id="name"
                  value={formData?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ingrese el primer nombre"
                  required
                />
              </FormField>

              <FormField id="middleName" label="Segundo Nombre">
                <Input
                  id="middleName"
                  value={formData?.middleName || ""}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  placeholder="Ingrese el segundo nombre (opcional)"
                />
              </FormField>

              <FormField id="lastname" label="Primer Apellido">
                <Input
                  id="lastname"
                  value={formData?.lastname || ""}
                  onChange={(e) => handleInputChange("lastname", e.target.value)}
                  placeholder="Ingrese el primer apellido"
                  required
                />
              </FormField>

              <FormField id="secondLastname" label="Segundo Apellido">
                <Input
                  id="secondLastname"
                  value={formData?.secondLastname || ""}
                  onChange={(e) => handleInputChange("secondLastname", e.target.value)}
                  placeholder="Ingrese el segundo apellido"
                  required
                />
              </FormField>

              <FormField id="birthdate" label="Fecha de Nacimiento">
                <Input
                  id="birthdate"
                  type="date"
                  value={formData?.birthdate || ""}
                  onChange={(e) => handleInputChange("birthdate", e.target.value)}
                  required
                />
              </FormField>

              <FormField id="gender" label="Género">
                <Select
                  value={formData?.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  required
                >
                  <option value="">Seleccionar género</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="NON_BINARY">No binario</option>
                  <option value="OTHER">Otro</option>
                </Select>
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información de Documento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField id="documentType" label="Tipo de Documento">
                <Select
                  value={formData?.idIdentityDocumentType || ""}
                  onChange={(e) => handleInputChange("idIdentityDocumentType", e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">Seleccionar tipo de documento</option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField id="documentNumber" label="Número de Documento">
                <Input
                  id="documentNumber"
                  value={formData?.identityDocument || ""}
                  onChange={(e) => handleInputChange("identityDocument", e.target.value)}
                  placeholder="Ingrese el número de documento"
                  required
                />
              </FormField>
            </div>
          </div>
        </div>
      </form>
    </ModalContainer>
  )
}