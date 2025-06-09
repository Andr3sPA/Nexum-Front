"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { ModalActions } from "@/components/molecules/modal-actions"

interface PersonalInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData: any
}

export default function PersonalInfoModal({ isOpen, onClose, onSave, initialData }: PersonalInfoModalProps) {
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave({ ...formData, lastUpdateDate: new Date().toISOString().split('T')[0] });
      onClose(); // Esta línea ya está presente, pero no funciona correctamente
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <ModalContainer title="Editar Información Personal" isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="maritalStatus" label="Estado Civil">
            <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soltero">Soltero(a)</SelectItem>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="union-libre">Unión Libre</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="viudo">Viudo(a)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="children" label="Número de Hijos">
            <Input
              id="children"
              type="number"
              value={formData.children}
              onChange={(e) => handleInputChange("children", e.target.value)}
            />
          </FormField>

          <FormField id="socioeconomicLevel" label="Estrato Socioeconómico">
            <Select
              value={formData.socioeconomicLevel}
              onValueChange={(value) => handleInputChange("socioeconomicLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="address" label="Dirección">
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </FormField>

          <FormField id="country" label="País">
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </FormField>

          <FormField id="department" label="Departamento">
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
            />
          </FormField>

          <FormField id="city" label="Ciudad">
            <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
          </FormField>

          <FormField id="landlinePhone" label="Teléfono Fijo">
            <Input
              id="landlinePhone"
              value={formData.landlinePhone}
              onChange={(e) => handleInputChange("landlinePhone", e.target.value)}
            />
          </FormField>

          <FormField id="cellPhone" label="Celular">
            <Input
              id="cellPhone"
              value={formData.cellPhone}
              onChange={(e) => handleInputChange("cellPhone", e.target.value)}
            />
          </FormField>

          <FormField id="whatsapp" label="WhatsApp">
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange("whatsapp", e.target.value)}
            />
          </FormField>

          <FormField id="whatsappAuthorization" label="Autoriza WhatsApp de la U">
            <Select
              value={formData.whatsappAuthorization}
              onValueChange={(value) => handleInputChange("whatsappAuthorization", value)}
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

          <FormField id="graduationDate" label="Fecha de Egreso">
            <Input
              id="graduationDate"
              type="date"
              value={formData.graduationDate}
              onChange={(e) => handleInputChange("graduationDate", e.target.value)}
            />
          </FormField>
        </div>

        <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
      </form>
    </ModalContainer>
  )
}

return (
  <ModalContainer title="Editar Información Personal" isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField id="maritalStatus" label="Estado Civil">
          <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soltero">Soltero(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="union-libre">Unión Libre</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viudo">Viudo(a)</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="children" label="Número de Hijos">
          <Input
            id="children"
            type="number"
            value={formData.children}
            onChange={(e) => handleInputChange("children", e.target.value)}
          />
        </FormField>

        <FormField id="socioeconomicLevel" label="Estrato Socioeconómico">
          <Select
            value={formData.socioeconomicLevel}
            onValueChange={(value) => handleInputChange("socioeconomicLevel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="6">6</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="address" label="Dirección">
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </FormField>

        <FormField id="country" label="País">
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
          />
        </FormField>

        <FormField id="department" label="Departamento">
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
        </FormField>

        <FormField id="city" label="Ciudad">
          <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
        </FormField>

        <FormField id="landlinePhone" label="Teléfono Fijo">
          <Input
            id="landlinePhone"
            value={formData.landlinePhone}
            onChange={(e) => handleInputChange("landlinePhone", e.target.value)}
          />
        </FormField>

        <FormField id="cellPhone" label="Celular">
          <Input
            id="cellPhone"
            value={formData.cellPhone}
            onChange={(e) => handleInputChange("cellPhone", e.target.value)}
          />
        </FormField>

        <FormField id="whatsapp" label="WhatsApp">
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
          />
        </FormField>

        <FormField id="whatsappAuthorization" label="Autoriza WhatsApp de la U">
          <Select
            value={formData.whatsappAuthorization}
            onValueChange={(value) => handleInputChange("whatsappAuthorization", value)}
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

        <FormField id="graduationDate" label="Fecha de Egreso">
          <Input
            id="graduationDate"
            type="date"
            value={formData.graduationDate}
            onChange={(e) => handleInputChange("graduationDate", e.target.value)}
          />
        </FormField>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="px-4 py-2" 
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="button" 
          className="udea-primary px-4 py-2" 
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);
            try {
              // Simulate API call
              await new Promise((resolve) => setTimeout(resolve, 500));
              onSave({ ...formData, lastUpdateDate: new Date().toISOString().split('T')[0] });
              onClose();
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  </ModalContainer>
)
}
