"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FileText, Filter, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { Button } from "@/components/atoms/button"

export interface ReportFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
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
  onSubmit: (e?: React.FormEvent) => void
  onClearFilters: () => void
  isLoading?: boolean
  programs: Array<{ id: number, name: string, code: string }>
  isLoadingPrograms?: boolean
}

const ReportFilters = React.forwardRef<HTMLDivElement, ReportFiltersProps>(
  ({ 
    className, 
    filters,
    onFilterChange,
    onSubmit,
    onClearFilters,
    isLoading = false,
    programs,
    isLoadingPrograms = false,
    ...props 
  }, ref) => {
    // Validación de rango de años
    const showYearError = filters.startYear && filters.endYear && Number(filters.startYear) > Number(filters.endYear)
    const hasActiveFilters = Object.values(filters).some(value => value !== "")

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit?.(e)
    }

    return (
      <Card className={cn("sticky top-24", className)} ref={ref} {...props}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold udea-primary-text">Filtros del Reporte</CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-4 px-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Año de graduación (desde) */}
            <div className="flex flex-col gap-1">
              <label htmlFor="startYear" className="text-sm font-medium text-gray-700">Año de Graduación (Desde)</label>
              <Select 
                id="startYear"
                value={filters.startYear} 
                onChange={e => onFilterChange("startYear", e.target.value)}
                className="h-11 text-base"
              >
                <option value="">Seleccionar</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Select>
            </div>

            {/* Año de graduación (hasta) */}
            <div className="flex flex-col gap-1">
              <label htmlFor="endYear" className="text-sm font-medium text-gray-700">Año de Graduación (Hasta)</label>
              <Select 
                id="endYear"
                value={filters.endYear} 
                onChange={e => onFilterChange("endYear", e.target.value)}
                className="h-11 text-base"
              >
                <option value="">Seleccionar</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Select>
              {showYearError && (
                <span className="text-xs text-red-600 mt-1">El año inicial no puede ser mayor que el año final.</span>
              )}
            </div>

            {/* Programa */}
            <div className="flex flex-col gap-1">
              <label htmlFor="programId" className="text-sm font-medium text-gray-700">Programa</label>
              <Select 
                value={filters.programId} 
                onChange={e => onFilterChange("programId", e.target.value)}
                className="h-11 text-base"
                disabled={isLoadingPrograms}
              >
                <option value="">Seleccionar</option>
                {isLoadingPrograms ? (
                  <option value="" disabled>Cargando programas...</option>
                ) : (
                  programs.map(p => (
                    <option key={p.id} value={p.id.toString()}>{p.name}</option>
                  ))
                )}
              </Select>
            </div>

            {/* Género */}
            <div className="flex flex-col gap-1">
              <label htmlFor="gender" className="text-sm font-medium text-gray-700">Género</label>
              <Select 
                value={filters.gender} 
                onChange={e => onFilterChange("gender", e.target.value)}
                className="h-11 text-base"
              >
                <option value="">Seleccionar</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Femenino</option>
                <option value="NON_BINARY">No binario</option>
                <option value="OTHER">Otro</option>
              </Select>
            </div>

            {/* País */}
            <div className="flex flex-col gap-1">
              <label htmlFor="country" className="text-sm font-medium text-gray-700">País</label>
              <Input
                id="country"
                placeholder="País"
                value={filters.country}
                onChange={e => onFilterChange("country", e.target.value)}
                maxLength={50}
                className="h-11 text-base"
              />
            </div>

            {/* Departamento */}
            <div className="flex flex-col gap-1">
              <label htmlFor="state" className="text-sm font-medium text-gray-700">Departamento</label>
              <Input
                id="state"
                placeholder="Departamento"
                value={filters.state}
                onChange={e => onFilterChange("state", e.target.value)}
                maxLength={50}
                className="h-11 text-base"
              />
            </div>

            {/* Ciudad */}
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">Ciudad</label>
              <Input
                id="city"
                placeholder="Ciudad"
                value={filters.city}
                onChange={e => onFilterChange("city", e.target.value)}
                maxLength={50}
                className="h-11 text-base"
              />
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">Dirección</label>
              <Input
                id="address"
                placeholder="Dirección"
                value={filters.address}
                onChange={e => onFilterChange("address", e.target.value)}
                maxLength={100}
                className="h-11 text-base"
              />
            </div>

            {/* Botón generar reporte (ocupa las dos columnas) */}
            <div className="col-span-1 md:col-span-2 pt-2">
              <Button 
                type="button" 
                className="w-full udea-primary h-11 text-base"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
)
ReportFilters.displayName = "ReportFilters"

export { ReportFilters } 