"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FileSpreadsheet, Filter, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { ReportFilters } from "@/components/molecules/report-filters"
import { ReportStats } from "@/components/molecules/report-stats"
import { ReportTable } from "@/components/atoms/report-table"
import { ReportExportModal } from "@/components/molecules/report-export-modal"
import { GraduateReportResponse, ReportFormat } from "@/lib/services/profile/report.service"

export interface ReportContainerProps {
  filters: {
    gender: string
    country: string
    state: string
    city: string
    address: string
    startYear: string
    endYear: string
    programId: string
  }
  onFilterChange: (field: string, value: string) => void
  onGenerateReport: (e?: React.FormEvent) => void
  onClearFilters: () => void
  onExport: (format: ReportFormat) => void
  reportData: GraduateReportResponse | null
  isGenerating: boolean
  isExporting: boolean
  programs: Array<{ id: number, name: string, code: string }>
  isLoadingPrograms: boolean
  filtersWidthClass?: string
  contentGapClass?: string
}

const ReportContainer = React.forwardRef<HTMLDivElement, ReportContainerProps>(
  ({ 
    filters,
    onFilterChange,
    onGenerateReport,
    onClearFilters,
    onExport,
    reportData,
    isGenerating,
    isExporting,
    programs,
    isLoadingPrograms,
    filtersWidthClass = "w-full md:w-[420px] lg:w-[480px]",
    contentGapClass = "gap-10",
    ...props 
  }, ref) => {
    const [showFilters, setShowFilters] = React.useState(true)
    const [exportModalOpen, setExportModalOpen] = React.useState(false)

    const hasActiveFilters = Object.values(filters).some(value => value !== "")

    // Columnas para la tabla de reporte
    const tableColumns = [
      { key: "names", label: "Nombres" },
      { key: "lastnames", label: "Apellidos" },
      { key: "email", label: "Email" },
      { key: "mobile", label: "Teléfono" },
      { key: "graduateGender", label: "Género" },
      { key: "occupation", label: "Ocupación" },
      { key: "identityDocument", label: "Documento" },
      { key: "graduationYear", label: "Año Graduación", align: "center" as const }
    ]

    const handleExport = (format: ReportFormat) => {
      onExport(format)
      setExportModalOpen(false)
    }

    return (
      <div ref={ref} {...props}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold udea-primary-text">Generar Reportes</CardTitle>
                <CardDescription>
                  Configura los parámetros para generar reportes estadísticos de egresados
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? "Ocultar" : "Mostrar"} Filtros
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className={cn("flex", contentGapClass)}>
          {/* Barra de filtros lateral */}
          {showFilters && (
            <div className={filtersWidthClass}>
              <ReportFilters
                filters={filters}
                onFilterChange={onFilterChange}
                onSubmit={onGenerateReport}
                onClearFilters={onClearFilters}
                isLoading={isGenerating}
                programs={programs}
                isLoadingPrograms={isLoadingPrograms}
              />
            </div>
          )}

          {/* Contenido principal */}
          <div className="flex-1">
            {reportData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl udea-primary-text">Reporte Generado</CardTitle>
                    <CardDescription>
                      {reportData.program} ({reportData.startYear} - {reportData.endYear})
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setExportModalOpen(true)} 
                    variant="outline" 
                    className="flex items-center gap-2" 
                    disabled={isGenerating || isExporting}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Exportar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Estadísticas */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Estadísticas Generales</h3>
                    <ReportStats data={reportData} />
                  </div>
                  
                  {/* Tabla de datos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Datos de Egresados</h3>
                    <ReportTable
                      columns={tableColumns}
                      data={reportData.users}
                      emptyMessage="No hay egresados que cumplan con los criterios seleccionados"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {!reportData && !isGenerating && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reporte generado</h3>
                    <p className="text-gray-500">
                      Configura los filtros y genera un reporte para ver los resultados
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Modal de exportación */}
        <ReportExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>
    )
  }
)
ReportContainer.displayName = "ReportContainer"

export { ReportContainer } 