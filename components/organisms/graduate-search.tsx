"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Filter, X, Search, Grid3X3, Table as TableIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { SearchFilters } from "@/components/molecules/search-filters"
import { SearchResults } from "@/components/molecules/search-results"
import { SearchEmptyState } from "@/components/atoms/search-empty-state"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/atoms/table"
import { GraduateSearchProps } from "@/types/graduate-search.types"

const GraduateSearch = React.forwardRef<HTMLDivElement, GraduateSearchProps>(
  (props, ref) => {
    const {
      filters,
      onFilterChange,
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
      sortBy = "",
      asc = true,
      onSortChange,
      ...restProps
    } = props

    const [showFilters, setShowFilters] = React.useState(true)
    const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards')

    const hasActiveFilters = Object.values(filters).some(value => value !== "")

    return (
      <div ref={ref} {...restProps}>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                  className="flex items-center gap-2"
                >
                  {viewMode === 'cards' ? <TableIcon className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  {viewMode === 'cards' ? 'Vista Tabla' : 'Vista Tarjetas'}
                </Button>
                <select
                  value={`${sortBy}-${asc}`}
                  onChange={(e) => {
                    const [sb, a] = e.target.value.split('-');
                    onSortChange && onSortChange(sb === 'none' ? '' : sb, a === 'true');
                  }}
                  className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="none-true">Sin ordenar</option>
                  <option value="coursedPrograms.graduationYear-true">Año de graduación asc</option>
                  <option value="coursedPrograms.graduationYear-false">Año de graduación desc</option>
                  <option value="name-true">Nombre asc</option>
                  <option value="name-false">Nombre desc</option>
                </select>
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
                onSubmit={props.onSearch}
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
                viewMode={viewMode}
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
