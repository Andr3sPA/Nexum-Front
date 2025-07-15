"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Users, GraduationCap, BookOpen, MessageSquare } from "lucide-react"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Select } from "@/components/atoms/select"
import { Switch } from "@/components/atoms/switch"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"
import { FormSection } from "@/components/atoms/form-section"
import { DynamicInputList } from "@/components/molecules/dynamic-input-list"

import { logger } from "@/lib/logging"
import { GraduateParticipationRequest, GraduateParticipationResponse } from "@/lib/services/profile/graduate-participation.service"
import { DetailedGraduateParticipationResponse } from "@/lib/services/profile/detailed-user.service"

interface ParticipationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GraduateParticipationRequest) => void
  initialData?: DetailedGraduateParticipationResponse
}

// Default values for the form
const defaultFormData: GraduateParticipationRequest = {
  userId: "",
  continuousEducationInterests: [],
  willingToBeSpeaker: false,
  willingToBeProfessor: false,
  willingToTeachNonFormalEducation: false,
  willingToBePostgraduateStudent: false,
  willingToBeNonFormalStudent: false,
  willingToBeGraduateRepresentative: false,
  willingToAttendAlumniMeetings: false,
  willingToParticipateInAlumniActivities: false,
}

export default function ParticipationModal({ isOpen, onClose, onSave, initialData }: ParticipationModalProps) {
  const [formData, setFormData] = useState<GraduateParticipationRequest>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        userId: "", // This should be set from context or props
        continuousEducationInterests: initialData.continuousEducationInterests || [],
        willingToBeSpeaker: initialData.willingToBeSpeaker || false,
        willingToBeProfessor: initialData.willingToBeProfessor || false,
        willingToTeachNonFormalEducation: initialData.willingToTeachNonFormalEducation || false,
        willingToBePostgraduateStudent: initialData.willingToBePostgraduateStudent || false,
        willingToBeNonFormalStudent: initialData.willingToBeNonFormalStudent || false,
        willingToBeGraduateRepresentative: initialData.willingToBeGraduateRepresentative || false,
        willingToAttendAlumniMeetings: initialData.willingToAttendAlumniMeetings || false,
        willingToParticipateInAlumniActivities: initialData.willingToParticipateInAlumniActivities || false,
      })
    } else if (isOpen) {
      setFormData(defaultFormData)
    }
  }, [isOpen, initialData])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)

    try {
      console.log("Submitting participation data:", formData)
      await onSave(formData)
      onClose()
    } catch (error) {
      logger.error("Error saving data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSave, onClose, isSubmitting])

  const handleInputChange = useCallback((field: keyof GraduateParticipationRequest, value: any) => {
    setFormData((prev: GraduateParticipationRequest) => ({ ...prev, [field]: value }))
  }, [])

  const handleSwitchChange = useCallback((field: keyof GraduateParticipationRequest, checked: boolean) => {
    setFormData((prev: GraduateParticipationRequest) => ({ ...prev, [field]: checked }))
  }, [])

  return (
    <ModalContainer 
      title="Información de Participación" 
      subtitle="Configure sus intereses y disponibilidad para participar en actividades de la UDEA"
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl"
      actions={
        <ModalActions 
          onCancel={onClose} 
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      }
    >
      <div className="space-y-8">
        <FormSection 
          title="Intereses de Formación Continua"
          description="Temas de interés para formación continua"
          icon={BookOpen}
          color="blue"
        >
          <FormField id="continuousEducationInterests" label="Temas de interés para formación continua">
            <DynamicInputList
              items={formData.continuousEducationInterests}
              onItemsChange={(interests: string[]) => handleInputChange("continuousEducationInterests", interests)}
              label="Temas de interés"
              placeholder="Agregue un tema de interés"
              addButtonText="Agregar tema"
            />
          </FormField>
        </FormSection>

        <FormSection 
          title="Disposición para Participar"
          description="Configure su disponibilidad para diferentes roles en la UDEA"
          icon={Users}
          color="green"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField id="willingToBeSpeaker" label="¿Desea participar como conferencista en la UDEA?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToBeSpeaker}
                    onCheckedChange={(checked) => handleSwitchChange("willingToBeSpeaker", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToBeSpeaker ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToBeProfessor" label="¿Desea participar como profesor en la UDEA?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToBeProfessor}
                    onCheckedChange={(checked) => handleSwitchChange("willingToBeProfessor", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToBeProfessor ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToTeachNonFormalEducation" label="¿Desea participar como profesor de educación no formal en la UDEA?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToTeachNonFormalEducation}
                    onCheckedChange={(checked) => handleSwitchChange("willingToTeachNonFormalEducation", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToTeachNonFormalEducation ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToBePostgraduateStudent" label="¿Desearía participar como estudiante de posgrado de la UDEA?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToBePostgraduateStudent}
                    onCheckedChange={(checked) => handleSwitchChange("willingToBePostgraduateStudent", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToBePostgraduateStudent ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToBeNonFormalStudent" label="¿Desearía participar como estudiante de formación no formal?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToBeNonFormalStudent}
                    onCheckedChange={(checked) => handleSwitchChange("willingToBeNonFormalStudent", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToBeNonFormalStudent ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToBeGraduateRepresentative" label="¿Te gustaría ser representante de los egresados?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToBeGraduateRepresentative}
                    onCheckedChange={(checked) => handleSwitchChange("willingToBeGraduateRepresentative", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToBeGraduateRepresentative ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToAttendAlumniMeetings" label="¿Te gustaría participar en encuentros de egresados?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToAttendAlumniMeetings}
                    onCheckedChange={(checked) => handleSwitchChange("willingToAttendAlumniMeetings", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToAttendAlumniMeetings ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>

              <FormField id="willingToParticipateInAlumniActivities" label="¿Te gustaría escribir o participar en actividades para egresados?">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.willingToParticipateInAlumniActivities}
                    onCheckedChange={(checked) => handleSwitchChange("willingToParticipateInAlumniActivities", checked)}
                  />
                  <span className="text-sm text-gray-600">
                    {formData.willingToParticipateInAlumniActivities ? "Sí" : "No"}
                  </span>
                </div>
              </FormField>
            </div>
          </div>
        </FormSection>
      </div>
    </ModalContainer>
  )
}
