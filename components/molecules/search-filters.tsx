"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { Button } from "@/components/atoms/button"
import { MultiSelect } from "@/components/molecules/multi-select"

export interface SearchFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: {
    names: string
    lastnames: string
    gender: string
    startYear: string
    endYear: string
    programIds: string[]
    country: string
    city: string
    mobile: string
    email: string
    academicEmail: string
  }
  onFilterChange: (field: string, value: string | string[]) => void
  onSubmit: (e?: React.FormEvent) => void
  isLoading?: boolean
  programs: Array<{ id: number, name: string, code: string }>
}

const SearchFilters = React.forwardRef<HTMLDivElement, SearchFiltersProps>(
  ({ 
    className, 
    filters,
    onFilterChange,
    onSubmit,
    isLoading = false,
    programs,
    ...props 
  }, ref) => {
    // Validación de rango de años
    const showYearError = filters.startYear && filters.endYear && Number(filters.startYear) > Number(filters.endYear)
    return (
      <Card className={cn("sticky top-24", className)} ref={ref} {...props}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold udea-primary-text">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="py-4 px-4">
          <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
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
              <label className="text-sm font-medium text-gray-700">Programas</label>
              <MultiSelect
                options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                selected={filters.programIds}
                onChange={(selected) => onFilterChange("programIds", selected)}
                placeholder="Seleccionar programas..."
                className="h-11 text-base"
              />
            </div>
            {/* Email académico */}
            <div className="flex flex-col gap-1">
              <label htmlFor="academicEmail" className="text-sm font-medium text-gray-700">Email Académico</label>
              <Input
                id="academicEmail"
                placeholder="Email académico"
                value={filters.academicEmail}
                onChange={e => onFilterChange("academicEmail", e.target.value)}
                maxLength={100}
                className="h-11 text-base"
              />
            </div>
            {/* El resto de campos */}
            {/* Nombres */}
            <div className="flex flex-col gap-1">
              <label htmlFor="names" className="text-sm font-medium text-gray-700">Nombres</label>
              <Input
                id="names"
                placeholder="Ej: Juan Carlos María"
                value={filters.names}
                onChange={e => onFilterChange("names", e.target.value)}
                maxLength={100}
                className="h-11 text-base"
              />
            </div>
            {/* Apellidos */}
            <div className="flex flex-col gap-1">
              <label htmlFor="lastnames" className="text-sm font-medium text-gray-700">Apellidos</label>
              <Input
                id="lastnames"
                placeholder="Ej: Pérez López"
                value={filters.lastnames}
                onChange={e => onFilterChange("lastnames", e.target.value)}
                maxLength={100}
                className="h-11 text-base"
              />
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
            {/* Teléfono */}
            <div className="flex flex-col gap-1">
              <label htmlFor="mobile" className="text-sm font-medium text-gray-700">Teléfono</label>
              <Input
                id="mobile"
                placeholder="Teléfono móvil"
                value={filters.mobile}
                onChange={e => onFilterChange("mobile", e.target.value)}
                maxLength={20}
                className="h-11 text-base"
              />
            </div>
            {/* Email personal */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Personal</label>
              <Input
                id="email"
                placeholder="Email personal"
                value={filters.email}
                onChange={e => onFilterChange("email", e.target.value)}
                maxLength={100}
                className="h-11 text-base"
              />
            </div>
            {/* Botón buscar (ocupa las dos columnas) */}
            <div className="col-span-1 md:col-span-2 pt-2">
              <Button 
                type="submit" 
                className="w-full udea-primary h-11 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
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
SearchFilters.displayName = "SearchFilters"

export { SearchFilters } 