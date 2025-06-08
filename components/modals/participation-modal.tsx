"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ParticipationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function ParticipationModal({ isOpen, onClose, onSave, initialData }: ParticipationModalProps) {
  const [formData, setFormData] = useState(initialData)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="udea-primary-text">Editar Participación</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="participation">Desde su egreso ha participado en</Label>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conferenceInterest">
                ¿Desea participar como conferencista en la Universidad de Antioquia?
              </Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="professorInterest">¿Desea participar como profesor en la Universidad de Antioquia?</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="nonFormalProfessorInterest">
                ¿Desea participar como profesor de educación no formal en la Universidad de Antioquia?
              </Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="postgraduateInterest">
                ¿Desearía participar como estudiante de posgrado de la Universidad de Antioquia?
              </Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="nonFormalStudentInterest">
                ¿Desearía participar como estudiante de formación no formal?
              </Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="representativeInterest">¿Te gustaría ser representante de los egresados?</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingsInterest">¿Te gustaría participar en encuentros de egresados?</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="activitiesInterest">
                ¿Te gustaría escribir o participar en actividades para egresados?
              </Label>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="continuousFormationTopics">¿En qué temas le interesaría realizar formación continua?</Label>
            <Textarea
              id="continuousFormationTopics"
              value={formData.continuousFormationTopics}
              onChange={(e) => handleInputChange("continuousFormationTopics", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="udea-primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
