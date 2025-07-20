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
    role?: string
    graduationYear?: string
    mobile?: string
  }>
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewProfile: (id: string) => void
  onExport?: () => void
  pageSize?: number
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