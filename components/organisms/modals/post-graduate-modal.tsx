"use client"

import React, { useState, useEffect } from "react"
import { BookOpen, Building2, MapPin } from "lucide-react"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Select } from "@/components/atoms/select"
import { Textarea } from "@/components/atoms/textarea"
import { ModalContainer } from "@/components/organisms/modal-container"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FormField } from "@/components/molecules/form-field"
import { FormSection } from "@/components/atoms/form-section"
import { useProfile } from "@/contexts/profile-context"
import { logger } from "@/lib/logging"
import { DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"

interface PostGraduateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  postGraduateData: DetailedAcademicEducationResponse[]
  editingItem?: DetailedAcademicEducationResponse | null
  userId: string
}

export function PostGraduateModal({
  isOpen,
  onClose,
  onSave,
  postGraduateData,
  editingItem,
  userId
}: PostGraduateModalProps) {
  const { createAcademicEducation, updateAcademicEducation } = useProfile()
  
  const [type, setType] = useState<"COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER">("COURSE")
  const [studyName, setStudyName] = useState("")
  const [institution, setInstitution] = useState("")
  const [country, setCountry] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form when modal opens or editing item changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        const validType = editingItem.type as "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER"
        setType(validType || "COURSE")
        setStudyName(editingItem.studyName || "")
        setInstitution(editingItem.institution || "")
        setCountry(editingItem.country || "")
      } else {
        setType("COURSE")
        setStudyName("")
        setInstitution("")
        setCountry("")
      }
    }
  }, [isOpen, editingItem])

  const handleSave = async () => {
    if (!type || !studyName || !institution || !country) {
      logger.warn("All fields must be filled")
      return
    }

    try {
      setIsSaving(true)
      
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario")
      }
      
      const formData = {
        userId: userId,
        type: type,
        studyName: studyName,
        institution: institution,
        country: country
      }
      
      if (editingItem) {
        await updateAcademicEducation(editingItem.id, formData)
      } else {
        await createAcademicEducation(formData)
      }
      
      onSave()
      onClose()
    } catch (error) {
      logger.error("Error saving post-graduate info:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "COURSE": return "Curso"
      case "DIPLOMA": return "Diploma"
      case "WORKSHOP": return "Workshop"
      case "HACKATHON": return "Hackathon"
      case "OTHER": return "Otro"
      default: return type
    }
  }

  return (
    <ModalContainer 
      title={editingItem ? "Editar Información de Posgrado" : "Agregar Información de Posgrado"}
      subtitle="Complete los detalles de su formación adicional o posgrado"
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl"
      onSubmit={handleSave}
      isSubmitting={isSaving}
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isSaving} />
      }
    >
      <div className="space-y-8">
        <FormSection 
          title="Información del Estudio"
          description="Detalles del programa de posgrado o formación adicional"
          icon={BookOpen}
          color="purple"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField id="type" label="Tipo de Estudio">
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER")}
                required
              >
                <option value="COURSE">Curso</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="OTHER">Otro</option>
              </Select>
            </FormField>

            <FormField id="studyName" label="Nombre del Estudio">
              <Input
                id="studyName"
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                placeholder="Ingrese el nombre del estudio"
                required
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Información de la Institución"
          description="Datos de la institución donde realizó el estudio"
          icon={Building2}
          color="blue"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField id="institution" label="Institución">
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Ingrese el nombre de la institución"
                required
              />
            </FormField>

            <FormField id="country" label="País">
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ingrese el país"
                required
              />
            </FormField>
          </div>
        </FormSection>

        {editingItem && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Editando: {getTypeLabel(editingItem.type)} - {editingItem.studyName}</span>
            </div>
          </div>
        )}
      </div>
    </ModalContainer>
  )
}
