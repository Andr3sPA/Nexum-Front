"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Filter, X, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { SearchFilters } from "@/components/molecules/search-filters"
import { SearchResults } from "@/components/molecules/search-results"
import { SearchEmptyState } from "@/components/atoms/search-empty-state"

export interface GraduateSearchProps {
  filters: {
    names: string
    lastnames: string
    gender: string
    startYear: string
    endYear: string
    programId: string
    country: string
    city: string
    mobile: string
    email: string
    academicEmail: string
  }
  onFilterChange: (field: string, value: string) => void
  onSearch: (e?: React.FormEvent) => void
  onClearFilters: () => void
  onViewProfile: (id: string) => void
  onExport?: () => void
  onPageChange: (page: number) => void
  results: Array<{
    id: string
    name: string
    middleName?: string
    lastname: string
    secondLastname?: string
    email?: string
    academicEmail?: string
    programs?: Array<{ name: string }>
    country?: string
    city?: string
    gender?: string
    role?: string
    graduationYear?: string
    mobile?: string
  }>
  totalCount: number
  currentPage: number
  totalPages: number
  isLoading?: boolean
  isSearching?: boolean
  programs: Array<{ id: number, name: string, code: string }>
  catalogError?: string | null
  filtersWidthClass?: string
  contentGapClass?: string
  pageSize?: number
  onPageSizeChange?: (size: number) => void
}

const GraduateSearch = React.forwardRef<HTMLDivElement, GraduateSearchProps>(
  ({ 
    filters,
    onFilterChange,
    onSearch,
    onClearFilters,
    onViewProfile,
    onExport,
    onPageChange,
    results,
    totalCount,
    currentPage,
    totalPages,
    isLoading = false,
    isSearching = false,
    programs,
    catalogError,
    filtersWidthClass = "w-80 flex-shrink-0",
    contentGapClass = "gap-6",
    pageSize,
    onPageSizeChange,
    ...props 
  }, ref) => {
    const [showFilters, setShowFilters] = React.useState(true)

    const hasActiveFilters = Object.values(filters).some(value => value !== "")

    return (
      <div ref={ref} {...props}>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold udea-primary-text">Buscador de Egresados</CardTitle>
                <CardDescription>Busque y filtre egresados por diferentes criterios</CardDescription>
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

        {/* Selector de cantidad de resultados por página alineado a la derecha */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700">Resultados por página:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={e => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white min-w-[60px] shadow-sm"
              style={{ minWidth: 60 }}
            >
              {[5, 10, 20, 30, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={cn("flex", contentGapClass)}>
          {/* Barra de filtros lateral */}
          {showFilters && (
            <div className={filtersWidthClass}>
              <SearchFilters
                filters={filters}
                onFilterChange={onFilterChange}
                onSubmit={onSearch}
                isLoading={isSearching}
                programs={programs}
              />
            </div>
          )}

          {/* Contenido principal */}
          <div className="flex-1">
            {catalogError && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-red-600 text-sm">{catalogError}</div>
                </CardContent>
              </Card>
            )}

            {results.length > 0 ? (
              <SearchResults
                results={results}
                totalCount={totalCount}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onViewProfile={onViewProfile}
                onExport={onExport}
                pageSize={pageSize}
              />
            ) : (
              <SearchEmptyState
                icon={Search}
                title={isSearching ? "Buscando egresados..." : "No se encontraron resultados"}
                description={
                  isSearching 
                    ? "Buscando egresados..." 
                    : "Intenta ajustar los filtros de búsqueda para encontrar más resultados."
                }
                isLoading={isSearching}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
)
GraduateSearch.displayName = "GraduateSearch"

export { GraduateSearch } 