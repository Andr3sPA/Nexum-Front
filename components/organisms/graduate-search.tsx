"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Filter, X, Search, Grid3X3, Table as TableIcon, Download, FileSpreadsheet, ArrowDownToLine, FileDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { SearchFilters } from "@/components/molecules/search-filters"
import { SearchResults } from "@/components/molecules/search-results"
import { SearchEmptyState } from "@/components/atoms/search-empty-state"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/atoms/table"
import { GraduateSearchProps } from "@/types/graduate-search.types"
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

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

    const exportGraduatesToExcel = (graduates: typeof results, filename: string = 'egresados.xlsx') => {
      // Transform data for export
      const exportData = graduates.map(graduate => ({
        'Nombre Completo': `${graduate.name} ${graduate.middleName || ''} ${graduate.lastname} ${graduate.secondLastname || ''}`.trim(),
        'Email': graduate.email || graduate.academicEmail || '',
        'Email Académico': graduate.academicEmail || '',
        'Teléfono': graduate.mobile || '',
        'Programa': graduate.programs?.map(p => p.name).join(', ') || '',
        'Año de Graduación': graduate.graduationYear || '',
        'Última Actualización': graduate.lastUpdateDate || '',
        'Empresa': graduate.company || '',
        'Colaboración': graduate.collaborationInfo || '',
        'País': graduate.country || '',
        'Ciudad': graduate.city || '',
        'Género': graduate.gender === 'MALE' ? 'Masculino' : graduate.gender === 'FEMALE' ? 'Femenino' : graduate.gender === 'NON_BINARY' ? 'No binario' : graduate.gender === 'OTHER' ? 'Otro' : '',
        'Rol': graduate.role === 'GRADUATE' ? 'Egresado' : graduate.role === 'ADMINISTRATIVE' ? 'Administrativo' : graduate.role === 'DEAN' ? 'Decano' : ''
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Auto-size columns
      const colWidths = [
        { wch: 25 }, // Nombre Completo
        { wch: 30 }, // Email
        { wch: 30 }, // Email Académico
        { wch: 15 }, // Teléfono
        { wch: 20 }, // Programa
        { wch: 18 }, // Año de Graduación
        { wch: 20 }, // Última Actualización
        { wch: 25 }, // Empresa
        { wch: 30 }, // Colaboración
        { wch: 15 }, // País
        { wch: 20 }, // Ciudad
        { wch: 12 }, // Género
        { wch: 15 }  // Rol
      ]
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Egresados')

      // Save file
      XLSX.writeFile(wb, filename)
    }

    const exportGraduatesToCSV = (graduates: typeof results, filename: string = 'egresados.csv') => {
      // Transform data for export
      const exportData = graduates.map(graduate => ({
        'Nombre Completo': `${graduate.name} ${graduate.middleName || ''} ${graduate.lastname} ${graduate.secondLastname || ''}`.trim(),
        'Email': graduate.email || graduate.academicEmail || '',
        'Email Académico': graduate.academicEmail || '',
        'Teléfono': graduate.mobile || '',
        'Programa': graduate.programs?.map(p => p.name).join(', ') || '',
        'Año de Graduación': graduate.graduationYear || '',
        'Última Actualización': graduate.lastUpdateDate || '',
        'Empresa': graduate.company || '',
        'Colaboración': graduate.collaborationInfo || '',
        'País': graduate.country || '',
        'Ciudad': graduate.city || '',
        'Género': graduate.gender === 'MALE' ? 'Masculino' : graduate.gender === 'FEMALE' ? 'Femenino' : graduate.gender === 'NON_BINARY' ? 'No binario' : graduate.gender === 'OTHER' ? 'Otro' : '',
        'Rol': graduate.role === 'GRADUATE' ? 'Egresado' : graduate.role === 'ADMINISTRATIVE' ? 'Administrativo' : graduate.role === 'DEAN' ? 'Decano' : ''
      }))

      // Use PapaParse to generate CSV
      const csv = Papa.unparse(exportData)

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

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
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'excel') {
                        exportGraduatesToExcel(results, `egresados_${new Date().toISOString().split('T')[0]}.xlsx`)
                      } else if (e.target.value === 'csv') {
                        exportGraduatesToCSV(results, `egresados_${new Date().toISOString().split('T')[0]}.csv`)
                      }
                      e.target.value = '' // Reset select
                    }}
                    className="appearance-none bg-primary text-white border border-primary rounded pl-3 pr-8 py-1 text-sm cursor-pointer hover:bg-primary/90 transition-colors"
                    defaultValue=""
                  >
                    <option value="" disabled>Exportar</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="csv">CSV (.csv)</option>
                  </select>

                  <FileDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-100 z-10" />
                </div>
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
