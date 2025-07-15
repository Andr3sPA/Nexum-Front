"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Select } from "@/components/atoms/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FormSection } from "@/components/atoms/form-section"
import { useProfile } from "@/contexts/profile-context"
import { FamilyInformationResponse } from "@/lib/services/profile/family-information.service"
import { logger } from "@/lib/logging"
import { Users, Heart, Baby } from "lucide-react"

interface FamilyInformationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FamilyFormData) => void
  familyData?: FamilyInformationResponse | null
}

interface FamilyFormData {
  maritalState: string
  childNumber: string
}

// Default values for the form
const defaultFormData: FamilyFormData = {
  maritalState: "",
  childNumber: ""
}

export function FamilyInformationModal({
  isOpen,
  onClose,
  onSave,
  familyData
}: FamilyInformationModalProps) {
  const { getUserId } = useProfile()
  const [formData, setFormData] = useState<FamilyFormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (familyData) {
      setFormData({
        maritalState: familyData.maritalState || "",
        childNumber: familyData.childNumber?.toString() || "",
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [familyData])

  const handleInputChange = (field: keyof FamilyFormData, value: string) => {
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
      logger.error("Error saving family information:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const maritalStateOptions = [
    { value: "SINGLE", label: "Soltero/a" },
    { value: "MARRIED", label: "Casado/a" },
    { value: "FREE_UNION", label: "Unión Libre" },
    { value: "DIVORCED", label: "Divorciado/a" },
  ]

  return (
    <ModalContainer 
      title={familyData ? "Editar Información Familiar" : "Agregar Información Familiar"}
      icon={Users}
      subtitle="Estado civil y composición familiar"
      color="purple"
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-3xl"
      onSubmit={handleSave}
      isSubmitting={isLoading}
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isLoading} />
      }
    >
      <div className="space-y-4">
        <FormSection
          icon={Heart}
          title="Estado Civil"
          description="Información sobre el estado civil actual"
          color="purple"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maritalState">Estado Civil</Label>
              <Select
                value={formData?.maritalState || ""}
                onChange={(e) => handleInputChange("maritalState", e.target.value)}
              >
                <option value="">Seleccionar estado civil</option>
                {maritalStateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Baby}
          title="Información de Hijos"
          description="Número de hijos en la familia"
          color="green"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childNumber">Número de Hijos</Label>
              <Input
                id="childNumber"
                type="number"
                min="0"
                value={formData?.childNumber || ""}
                onChange={(e) => handleInputChange("childNumber", e.target.value)}
                placeholder="Ingrese el número de hijos"
              />
            </div>
          </div>
        </FormSection>
      </div>
    </ModalContainer>
  )
} 