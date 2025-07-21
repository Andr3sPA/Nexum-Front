"use client"

import { Button } from "@/components/atoms/button"

interface ModalActionsProps {
  onCancel: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
  cancelText?: string
  submitText?: string
}

export function ModalActions({
  onCancel,
  onSubmit,
  isSubmitting = false,
  cancelText = "Cancelar",
  submitText = "Guardar Cambios",
}: ModalActionsProps) {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className="flex justify-end space-x-3 p-6 pt-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
      <Button type="button" variant="outline" onClick={onCancel} className="px-4 py-2" disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button type="submit" className="udea-primary px-4 py-2" disabled={isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? "Guardando..." : submitText}
      </Button>
    </div>
  )
}
