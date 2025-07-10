"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FamilyInformationResponse } from "@/lib/services/profile/family-information.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { logger } from "@/lib/logging"

interface FamilyInformationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FamilyFormData) => void
  familyData: FamilyInformationResponse | null
}

interface FamilyFormData {
  maritalState: "MARRIED" | "DIVORCED" | "SINGLE" | "FREE_UNION"
  childNumber: number
}

const maritalStateOptions = [
  { value: "SINGLE", label: "Soltero/a" },
  { value: "MARRIED", label: "Casado/a" },
  { value: "DIVORCED", label: "Divorciado/a" },
  { value: "FREE_UNION", label: "Unión Libre" }
]

export function FamilyInformationModal({
  isOpen,
  onClose,
  onSave,
  familyData
}: FamilyInformationModalProps) {
  const [formData, setFormData] = useState<FamilyFormData>({
    maritalState: "SINGLE",
    childNumber: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  // Get user from localStorage
  const user = LocalStorageService.getItem<any>("user")

  useEffect(() => {
    if (familyData) {
      setFormData({
        maritalState: familyData.maritalState,
        childNumber: familyData.childNumber
      })
    } else {
      setFormData({
        maritalState: "SINGLE",
        childNumber: 0
      })
    }
  }, [familyData])

  const handleInputChange = (field: keyof FamilyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === "childNumber" ? Number(value) : value
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
      logger.error("Error saving family information:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {familyData ? "Editar Información Familiar" : "Agregar Información Familiar"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maritalState">Estado Civil</Label>
              <Select
                value={formData.maritalState}
                onValueChange={(value) => handleInputChange("maritalState", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado civil" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="childNumber">Número de Hijos</Label>
              <Input
                id="childNumber"
                type="number"
                min="0"
                value={formData.childNumber}
                onChange={(e) => handleInputChange("childNumber", e.target.value)}
                placeholder="Ingrese el número de hijos"
              />
            </div>
          </div>

          <ModalActions
            onCancel={onClose}
            isSubmitting={isLoading}
            submitText={familyData ? "Actualizar" : "Guardar"}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
} 