"use client"

import { Button } from "@/components/atoms/button"

interface ModalActionsProps {
  onCancel: () => void
  isSubmitting?: boolean
  cancelText?: string
  submitText?: string
}

export function ModalActions({
  onCancel,
  isSubmitting = false,
  cancelText = "Cancelar",
  submitText = "Guardar Cambios",
}: ModalActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button type="button" variant="outline" onClick={onCancel} className="px-4 py-2" disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button type="submit" className="udea-primary px-4 py-2" disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : submitText}
      </Button>
    </div>
  )
}
