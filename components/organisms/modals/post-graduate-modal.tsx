"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Select } from "@/components/atoms/select"
import { ModalActions } from "@/components/molecules/modal-actions"
import { logger } from "@/lib/logging"
import { AcademicEducationService } from "@/lib/services/profile/academic-education.service"
import { DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"

interface PostGraduateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  postGraduateData: DetailedAcademicEducationResponse[]
  editingItem?: DetailedAcademicEducationResponse | null
}

export function PostGraduateModal({
  isOpen,
  onClose,
  onSave,
  postGraduateData,
  editingItem
}: PostGraduateModalProps) {
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
      
      // Get user from localStorage
      const user = LocalStorageService.getItem<{ id: string }>("user")
      const userProfile = LocalStorageService.getItem<{ id: string }>("userProfile")
      const userId = userProfile?.id || user?.id
      
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario")
      }

      if (editingItem) {
        // Update existing academic education
        await AcademicEducationService.updateById(editingItem.id, {
          userId: userId,
          type: type,
          studyName: studyName,
          institution: institution,
          country: country
        })
      } else {
        // Create new academic education
        await AcademicEducationService.create({
          userId: userId,
          type: type,
          studyName: studyName,
          institution: institution,
          country: country
        })
      }

      onSave()
      onClose()
    } catch (error) {
      logger.error("Error saving post-graduate info:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editingItem ? "Editar Estudio Post Graduación" : "Nuevo Estudio Post Graduación"}
        </h2>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            {/* Type */}
            <div>
              <Label htmlFor="type">Tipo de Estudio Post Graduación</Label>
              <Select 
                value={type} 
                onChange={(e) => setType(e.target.value as "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER")}
              >
                <option value="">Selecciona un tipo</option>
                <option value="COURSE">Curso</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="WORKSHOP">Taller</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="OTHER">Otro</option>
              </Select>
            </div>

            {/* Study Name */}
            <div>
              <Label htmlFor="studyName">Nombre del Estudio</Label>
              <Input
                id="studyName"
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                placeholder="Ej: Maestría en Informática"
                required
              />
            </div>

            {/* Institution */}
            <div>
              <Label htmlFor="institution">Institución</Label>
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Ej: Universidad de Antioquia"
                required
              />
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ej: Colombia"
                required
              />
            </div>
          </div>

          <ModalActions
            onCancel={onClose}
            isSubmitting={isSaving}
          />
        </form>
      </div>
    </div>
  )
}
