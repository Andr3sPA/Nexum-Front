"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/molecules/card"

export interface SearchEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  isLoading?: boolean
}

const SearchEmptyState = React.forwardRef<HTMLDivElement, SearchEmptyStateProps>(
  ({ 
    className, 
    icon: Icon, 
    title, 
    description, 
    isLoading = false,
    ...props 
  }, ref) => {
    return (
      <Card className={cn("", className)} ref={ref} {...props}>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            {isLoading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            ) : (
              <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
)
SearchEmptyState.displayName = "SearchEmptyState"

export { SearchEmptyState } 