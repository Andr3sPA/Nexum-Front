import React from 'react'
import { Button } from '@/components/atoms/button'
import { OpportunityRequest } from '@/lib/services/opportunity/opportunity.service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/molecules/dialog'

interface OpportunityConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  pendingFormData: OpportunityRequest | null
  isEditMode: boolean
  loading: boolean
}

export const OpportunityConfirmationDialog: React.FC<OpportunityConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  pendingFormData,
  isEditMode,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar {isEditMode ? 'Actualización' : 'Creación'} de Oportunidad</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea {isEditMode ? 'actualizar' : 'crear'} esta oportunidad laboral?
          </DialogDescription>
        </DialogHeader>

        {pendingFormData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Resumen de la oportunidad:</h4>
            <p>
              <strong>Título:</strong> {pendingFormData.title}
            </p>
            <p>
              <strong>Empresa:</strong> {pendingFormData.businessName || 'No especificada'}
            </p>
            <p>
              <strong>Ubicación:</strong> {pendingFormData.location || 'No especificada'}
            </p>
            <p>
              <strong>Modalidad:</strong> {pendingFormData.workModality}
            </p>
            <p>
              <strong>Programas:</strong> {pendingFormData.coursedProgramIds.length} seleccionados
            </p>
            <p>
              <strong>Competencias:</strong> {pendingFormData.programCompetencyIds.length} seleccionadas
            </p>
            <p>
              <strong>Áreas:</strong> {pendingFormData.jobAreaIds.length} seleccionadas
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isEditMode ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              `Confirmar ${isEditMode ? 'Actualización' : 'Creación'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}