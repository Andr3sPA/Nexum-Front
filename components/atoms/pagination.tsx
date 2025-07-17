"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/atoms/button"

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageInfo?: boolean
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    className, 
    currentPage,
    totalPages,
    onPageChange,
    showPageInfo = true,
    ...props 
  }, ref) => {
    const canGoPrevious = currentPage > 0
    const canGoNext = currentPage + 1 < totalPages

    return (
      <div 
        className={cn("flex justify-center items-center gap-4", className)} 
        ref={ref} 
        {...props}
      >
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!canGoPrevious} 
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        
        {showPageInfo && (
          <span className="text-sm text-gray-600">
            Página {currentPage + 1} de {totalPages}
          </span>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          disabled={!canGoNext} 
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    )
  }
)
Pagination.displayName = "Pagination"

export { Pagination } 