"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AcademicInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function AcademicInfoModal({ isOpen, onClose, onSave, initialData }: AcademicInfoModalProps) {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="udea-primary-text">Editar Información Académica</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Año de Graduación</Label>
              <Input
                id="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange("graduationYear", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Programa Cursado en la UdeA</Label>
              <Select value={formData.program} onValueChange={(value) => handleInputChange("program", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar programa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingenieria-sistemas">Ingeniería de Sistemas</SelectItem>
                  <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="derecho">Derecho</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studyPlan">Plan de Estudios</Label>
              <Select value={formData.studyPlan} onValueChange={(value) => handleInputChange("studyPlan", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plan-2020">Plan 2020</SelectItem>
                  <SelectItem value="plan-2018">Plan 2018</SelectItem>
                  <SelectItem value="plan-2015">Plan 2015</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Durante su formación fue</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auxiliar-administrativo">Auxiliar administrativo</SelectItem>
                  <SelectItem value="monitor">Monitor</SelectItem>
                  <SelectItem value="auxiliar-programacion">Auxiliar de Programación</SelectItem>
                  <SelectItem value="joven-investigador">Joven investigador</SelectItem>
                  <SelectItem value="ninguno">Ninguno de los anteriores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="udea-primary">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
