"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import { logger } from "@/lib/logging"

interface PostGraduateEntry {
  id: number
  type: string
  name: string
  institution: string
  country: string
}

interface PostGraduateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: PostGraduateEntry[]) => void
  initialData: PostGraduateEntry[]
}

export default function PostGraduateModal({ isOpen, onClose, onSave, initialData }: PostGraduateModalProps) {
  const [formData, setFormData] = useState<PostGraduateEntry[]>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(formData)
    } catch (error) {
      logger.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    setFormData((prev: PostGraduateEntry[]) => {
      const newData = [...prev]
      newData[index] = { ...newData[index], [field]: value }
      return newData
    })
  }

  const removeEntry = (index: number) => {
    setFormData((prev: PostGraduateEntry[]) => prev.filter((_, i: number) => i !== index))
  }

  return (
    <ModalContainer
      title="Editar Información Académica Pos Pregrado"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.map((entry: PostGraduateEntry, index: number) => (
          <div key={entry.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Estudio {index + 1}</h4>
              {formData.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeEntry(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id={`type-${index}`} label="Tipo">
                <Select value={entry.type} onValueChange={(value) => handleInputChange(index, "type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curso">Curso</SelectItem>
                    <SelectItem value="diplomado">Diplomado</SelectItem>
                    <SelectItem value="taller">Taller</SelectItem>
                    <SelectItem value="hackaton">Hackaton</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id={`name-${index}`} label="Nombre del Estudio">
                <Input value={entry.name} onChange={(e) => handleInputChange(index, "name", e.target.value)} />
              </FormField>

              <FormField id={`institution-${index}`} label="Institución">
                <Select
                  value={entry.institution}
                  onValueChange={(value) => handleInputChange(index, "institution", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar institución" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="udea">Universidad de Antioquia</SelectItem>
                    <SelectItem value="unal">Universidad Nacional</SelectItem>
                    <SelectItem value="javeriana">Pontificia Universidad Javeriana</SelectItem>
                    <SelectItem value="andes">Universidad de los Andes</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                    {/* TODO: Get institutions from backend */}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField id={`country-${index}`} label="País">
                <Select value={entry.country} onValueChange={(value) => handleInputChange(index, "country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colombia">Colombia</SelectItem>
                    <SelectItem value="usa">Estados Unidos</SelectItem>
                    <SelectItem value="spain">España</SelectItem>
                    <SelectItem value="france">Francia</SelectItem>
                    <SelectItem value="germany">Alemania</SelectItem>
                    {/* TODO: Get countries from backend */}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>
        ))}

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
