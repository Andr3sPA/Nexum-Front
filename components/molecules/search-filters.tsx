"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { Button } from "@/components/atoms/button"

export interface SearchFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: {
    names: string
    lastnames: string
    gender: string
    birthdate: string
    graduationYear: string
    programId: string
    country: string
    city: string
    mobile: string
    email: string
    academicEmail: string
  }
  onFilterChange: (field: string, value: string) => void
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
    return (
      <Card className={cn("sticky top-24", className)} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold udea-primary-text">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="names" className="text-sm font-medium text-gray-700">
                  Nombres
                </label>
                <Input
                  id="names"
                  placeholder="Ej: Juan Carlos María"
                  value={filters.names}
                  onChange={e => onFilterChange("names", e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500">
                  Incluye primer nombre, segundo nombre, etc.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastnames" className="text-sm font-medium text-gray-700">
                  Apellidos
                </label>
                <Input
                  id="lastnames"
                  placeholder="Ej: Pérez López"
                  value={filters.lastnames}
                  onChange={e => onFilterChange("lastnames", e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500">
                  Incluye primer apellido, segundo apellido, etc.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Género
                </label>
                <Select 
                  value={filters.gender} 
                  onChange={e => onFilterChange("gender", e.target.value)}
                >
                  <option value="">Seleccionar género</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="NON_BINARY">No binario</option>
                  <option value="OTHER">Otro</option>
                </Select>
              </div>
                        
              <div className="space-y-2">
                <label htmlFor="graduationYear" className="text-sm font-medium text-gray-700">
                  Año de Graduación
                </label>
                <Select 
                  value={filters.graduationYear} 
                  onChange={e => onFilterChange("graduationYear", e.target.value)}
                >
                  <option value="">Seleccionar año</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="programId" className="text-sm font-medium text-gray-700">
                  Programa Académico
                </label>
                <Select 
                  value={filters.programId} 
                  onChange={e => onFilterChange("programId", e.target.value)}
                >
                  <option value="">Seleccionar programa</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">
                  País
                </label>
                <Input
                  id="country"
                  placeholder="País"
                  value={filters.country}
                  onChange={e => onFilterChange("country", e.target.value)}
                  maxLength={50}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <Input
                  id="city"
                  placeholder="Ciudad"
                  value={filters.city}
                  onChange={e => onFilterChange("city", e.target.value)}
                  maxLength={50}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Input
                  id="mobile"
                  placeholder="Teléfono móvil"
                  value={filters.mobile}
                  onChange={e => onFilterChange("mobile", e.target.value)}
                  maxLength={20}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Personal
                </label>
                <Input
                  id="email"
                  placeholder="Email personal"
                  value={filters.email}
                  onChange={e => onFilterChange("email", e.target.value)}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="academicEmail" className="text-sm font-medium text-gray-700">
                  Email Académico
                </label>
                <Input
                  id="academicEmail"
                  placeholder="Email académico"
                  value={filters.academicEmail}
                  onChange={e => onFilterChange("academicEmail", e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full udea-primary" 
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