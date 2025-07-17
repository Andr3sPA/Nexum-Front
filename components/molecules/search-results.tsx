"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Download } from "lucide-react"
import { Card, CardContent } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { GraduateCard } from "@/components/atoms/graduate-card"
import { Pagination } from "@/components/atoms/pagination"

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
  }>
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewProfile: (id: string) => void
  onExport?: () => void
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
    ...props 
  }, ref) => {
    if (results.length === 0) {
      return null
    }

    return (
      <Card className={cn("", className)} ref={ref} {...props}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Mostrando {results.length} de {totalCount} resultados
            </div>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.map(graduate => (
              <GraduateCard
                key={graduate.id}
                graduate={graduate}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
          
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