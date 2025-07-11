"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Select } from "@/components/atoms/select"
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
          <Select 
            value={formData.participation} 
            onChange={(e) => handleInputChange("participation", e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="startups">Startups</option>
            <option value="emprendimientos">Emprendimientos</option>
            <option value="empresas">Empresas</option>
            <option value="patentes">Patentes</option>
            <option value="registros-software">Registros de software</option>
            <option value="ventures">Ventures</option>
            <option value="concursos-innovacion">Concursos de innovación</option>
            <option value="otros">Otros procesos de innovación</option>
          </Select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="conferenceInterest" label="Desea participar como conferencista en la UDEA">
            <Select
              value={formData.conferenceInterest}
              onChange={(e) => handleInputChange("conferenceInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField id="professorInterest" label="Desea participar como profesor en la UDEA">
            <Select
              value={formData.professorInterest}
              onChange={(e) => handleInputChange("professorInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField
            id="nonFormalProfessorInterest"
            label="Desea participar como profesor de educación no formal en la UDEA"
          >
            <Select
              value={formData.nonFormalProfessorInterest}
              onChange={(e) => handleInputChange("nonFormalProfessorInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField id="postgraduateInterest" label="Desearía participar como estudiante de posgrado de la UDEA">
            <Select
              value={formData.postgraduateInterest}
              onChange={(e) => handleInputChange("postgraduateInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField id="nonFormalStudentInterest" label="Desearía participar como estudiante de formación no formal">
            <Select
              value={formData.nonFormalStudentInterest}
              onChange={(e) => handleInputChange("nonFormalStudentInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField id="representativeInterest" label="Te gustaría ser representante de los egresados">
            <Select
              value={formData.representativeInterest}
              onChange={(e) => handleInputChange("representativeInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField id="meetingsInterest" label="Te gustaría participar en encuentros de egresados">
            <Select
              value={formData.meetingsInterest}
              onChange={(e) => handleInputChange("meetingsInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Select>
          </FormField>

          <FormField id="activitiesInterest" label="Te gustaría escribir o participar en actividades para egresados">
            <Select
              value={formData.activitiesInterest}
              onChange={(e) => handleInputChange("activitiesInterest", e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
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
