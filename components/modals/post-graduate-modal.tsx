"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface PostGraduateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function PostGraduateModal({ isOpen, onClose, onSave, initialData }: PostGraduateModalProps) {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const newData = [...prev]
      newData[index] = { ...newData[index], [field]: value }
      return newData
    })
  }

  const removeEntry = (index: number) => {
    setFormData((prev: any) => prev.filter((_: any, i: number) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="udea-primary-text">Editar Información Académica Pos Pregrado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.map((entry: any, index: number) => (
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
                <div className="space-y-2">
                  <Label>Tipo</Label>
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
                </div>
                <div className="space-y-2">
                  <Label>Nombre del Estudio</Label>
                  <Input value={entry.name} onChange={(e) => handleInputChange(index, "name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Institución</Label>
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
                </div>
                <div className="space-y-2">
                  <Label>País</Label>
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
                </div>
              </div>
            </div>
          ))}
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
