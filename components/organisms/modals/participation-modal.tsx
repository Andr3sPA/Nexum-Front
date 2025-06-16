"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

import { logger } from "@/lib/logging"

interface ParticipationData {
  participationType: string
  eventName: string
  eventDate: string
  role: string
  description: string
  participation: string
  conferenceInterest: string
  professorInterest: string
  nonFormalProfessorInterest: string
  postgraduateInterest: string
  nonFormalStudentInterest: string
  representativeInterest: string
  meetingsInterest: string
  activitiesInterest: string
  continuousFormationTopics: string
}

interface ParticipationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ParticipationData) => void
  initialData: ParticipationData
}

export default function ParticipationModal({ isOpen, onClose, onSave, initialData }: ParticipationModalProps) {
  const [formData, setFormData] = useState<ParticipationData>(initialData)
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

  const handleInputChange = (field: keyof ParticipationData, value: string) => {
    setFormData((prev: ParticipationData) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer title="Editar Participación" isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="participation" label="Desde su egreso ha participado en">
          <Select value={formData.participation} onValueChange={(value) => handleInputChange("participation", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startups">Startups</SelectItem>
              <SelectItem value="emprendimientos">Emprendimientos</SelectItem>
              <SelectItem value="empresas">Empresas</SelectItem>
              <SelectItem value="patentes">Patentes</SelectItem>
              <SelectItem value="registros-software">Registros de software</SelectItem>
              <SelectItem value="ventures">Ventures</SelectItem>
              <SelectItem value="concursos-innovacion">Concursos de innovación</SelectItem>
              <SelectItem value="otros">Otros procesos de innovación</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="conferenceInterest" label="Desea participar como conferencista en la UDEA">
            <Select
              value={formData.conferenceInterest}
              onValueChange={(value) => handleInputChange("conferenceInterest", value)}
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

          <FormField id="professorInterest" label="Desea participar como profesor en la UDEA">
            <Select
              value={formData.professorInterest}
              onValueChange={(value) => handleInputChange("professorInterest", value)}
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

          <FormField
            id="nonFormalProfessorInterest"
            label="Desea participar como profesor de educación no formal en la UDEA"
          >
            <Select
              value={formData.nonFormalProfessorInterest}
              onValueChange={(value) => handleInputChange("nonFormalProfessorInterest", value)}
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

          <FormField id="postgraduateInterest" label="Desearía participar como estudiante de posgrado de la UDEA">
            <Select
              value={formData.postgraduateInterest}
              onValueChange={(value) => handleInputChange("postgraduateInterest", value)}
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

          <FormField id="nonFormalStudentInterest" label="Desearía participar como estudiante de formación no formal">
            <Select
              value={formData.nonFormalStudentInterest}
              onValueChange={(value) => handleInputChange("nonFormalStudentInterest", value)}
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

          <FormField id="representativeInterest" label="Te gustaría ser representante de los egresados">
            <Select
              value={formData.representativeInterest}
              onValueChange={(value) => handleInputChange("representativeInterest", value)}
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

          <FormField id="meetingsInterest" label="Te gustaría participar en encuentros de egresados">
            <Select
              value={formData.meetingsInterest}
              onValueChange={(value) => handleInputChange("meetingsInterest", value)}
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

          <FormField id="activitiesInterest" label="Te gustaría escribir o participar en actividades para egresados">
            <Select
              value={formData.activitiesInterest}
              onValueChange={(value) => handleInputChange("activitiesInterest", value)}
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
        </div>

        <FormField id="continuousFormationTopics" label="En qué temas le interesaría realizar formación continua">
          <Textarea
            id="continuousFormationTopics"
            value={formData.continuousFormationTopics}
            onChange={(e) => handleInputChange("continuousFormationTopics", e.target.value)}
            rows={3}
          />
        </FormField>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}
