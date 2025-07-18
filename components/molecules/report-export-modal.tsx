import React from "react"
import { FileSpreadsheet, FileText, FileCode, X } from "lucide-react"
import { Button } from "@/components/atoms/button"
import { ReportFormat } from "@/lib/services/profile/report.service"

export interface ReportExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: ReportFormat) => void
  isExporting: boolean
}

const exportOptions = [
  {
    format: "PDF" as ReportFormat,
    label: "Exportar PDF",
    description: "Documento PDF con formato profesional",
    icon: FileText,
    variant: "primary" as const
  },
  {
    format: "XLSX" as ReportFormat,
    label: "Exportar Excel",
    description: "Hoja de cálculo editable",
    icon: FileSpreadsheet,
    variant: "outline" as const
  },
  {
    format: "HTML" as ReportFormat,
    label: "Exportar HTML",
    description: "Página web interactiva",
    icon: FileCode,
    variant: "secondary" as const
  }
]

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Exportar Reporte</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-3 mb-6">
          {exportOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.format}
                variant={option.variant}
                onClick={() => onExport(option.format)}
                disabled={isExporting}
                className="w-full h-auto p-4 flex items-start gap-3 text-left"
              >
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-800">{option.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
        
        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full"
          disabled={isExporting}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
} 