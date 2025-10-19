"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Download } from "lucide-react"
import { Card, CardContent } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { GraduateCard } from "@/components/atoms/graduate-card"
import { Pagination } from "@/components/atoms/pagination"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/atoms/table"

export interface SearchResultsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'results'> {
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
    lastUpdateDate?: string
    company?: string
    collaborationInfo?: string
  }>
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewProfile: (id: string) => void
  onExport?: () => void
  pageSize?: number
  viewMode?: 'cards' | 'table'
}

const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(
  ({
    className,
    results,
    totalCount,
    currentPage,
    totalPages,
    onPageChange,
    onViewProfile,
    onExport,
    pageSize = 10,
    viewMode = 'cards',
    ...props
  }, ref) => {
    if (results.length === 0) {
      return null
    }

    // Calcular el rango de resultados mostrados
    const start = totalCount === 0 ? 0 : currentPage * pageSize + 1
    const end = Math.min((currentPage + 1) * pageSize, totalCount)

    return (
      <Card className={cn("", className)} ref={ref} {...props}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="text-sm text-gray-600">
              Mostrando {start}-{end} de {totalCount} resultados
            </div>
          </div>
          
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map(graduate => (
                <GraduateCard
                  key={graduate.id}
                  graduate={graduate}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          ) : (
            <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Nombre Completo</TableHead>
                   <TableHead>Email</TableHead>
                   <TableHead>Teléfono</TableHead>
                   <TableHead>Año de Egreso</TableHead>
                   <TableHead>Última Actualización</TableHead>
                   <TableHead>Empresa</TableHead>
                   <TableHead>Colaboración</TableHead>
                   <TableHead>Acciones</TableHead>
                 </TableRow>
               </TableHeader>
              <TableBody>
                {results.map(graduate => (
                  <TableRow key={graduate.id}>
                    <TableCell>{`${graduate.name} ${graduate.middleName || ''} ${graduate.lastname} ${graduate.secondLastname || ''}`.trim()}</TableCell>
                    <TableCell>{graduate.email || graduate.academicEmail || '-'}</TableCell>
                    <TableCell>{graduate.mobile || '-'}</TableCell>
                    <TableCell>{graduate.graduationYear || '-'}</TableCell>
                    <TableCell>{graduate.lastUpdateDate || '-'}</TableCell>
                    <TableCell>{graduate.company || '-'}</TableCell>
                    <TableCell>{graduate.collaborationInfo || '-'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => onViewProfile(graduate.id)}>
                        Ver Perfil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="mt-6"
          />
        </CardContent>
      </Card>
    )
  }
)
SearchResults.displayName = "SearchResults"

export { SearchResults } 