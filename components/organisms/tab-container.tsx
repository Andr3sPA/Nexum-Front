"use client"

import React, { ReactNode } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { EditButton } from "@/components/atoms/edit-button"
import { AddButton } from "@/components/atoms/add-button"
import { SectionTitle } from "@/components/atoms/section-title"
import { Card, CardContent } from "@/components/molecules/card"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface TabContainerProps {
  title: string
  children: ReactNode
  onEdit?: () => void
  onAdd?: () => void
  isLoading?: boolean
  error?: string | null
  showEditButton?: boolean
  showAddButton?: boolean
  editButtonText?: string
  addButtonText?: string
  className?: string
}

interface TabSectionProps {
  title: string
  children: ReactNode
  onEdit?: () => void
  onAdd?: () => void
  showEditButton?: boolean
  showAddButton?: boolean
  editButtonText?: string
  addButtonText?: string
  className?: string
  useCard?: boolean
}

interface TabDataFieldProps {
  label: string
  value: string | ReactNode
  className?: string
}

interface TabEmptyStateProps {
  message?: string
  className?: string
}

export function TabContainer({
  title,
  children,
  onEdit,
  onAdd,
  isLoading = false,
  error = null,
  showEditButton = true,
  showAddButton = false,
  editButtonText = "Editar",
  addButtonText = "Agregar",
  className = ""
}: TabContainerProps) {
  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center">
        <SectionTitle>{title}</SectionTitle>
        <div className="flex gap-2">
          {showAddButton && onAdd && (
            <AddButton onClick={onAdd}>{addButtonText}</AddButton>
          )}
          {showEditButton && onEdit && (
            <EditButton onClick={onEdit} text={editButtonText} />
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Cargando...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {!isLoading && !error && children}
    </div>
  )
}

export function TabSection({
  title,
  children,
  onEdit,
  onAdd,
  showEditButton = true,
  showAddButton = false,
  editButtonText = "Editar",
  addButtonText = "Agregar",
  className = "",
  useCard = false
}: TabSectionProps) {
  if (useCard) {
    return (
      <DataSection 
        title={title} 
        action={
          <div className="flex gap-2">
            {showAddButton && onAdd && (
              <AddButton onClick={onAdd}>{addButtonText}</AddButton>
            )}
            {showEditButton && onEdit && (
              <EditButton onClick={onEdit} text={editButtonText} />
            )}
          </div>
        }
      >
        {children}
      </DataSection>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Simple header without card styling */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          {showAddButton && onAdd && (
            <AddButton onClick={onAdd}>{addButtonText}</AddButton>
          )}
          {showEditButton && onEdit && (
            <EditButton onClick={onEdit} text={editButtonText} />
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export function TabDataField({ label, value, className = "" }: TabDataFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="text-gray-900 text-base">
        {value || "No hay datos"}
      </div>
    </div>
  )
}

export function TabEmptyState({ message = "No hay datos disponibles", className = "" }: TabEmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <p className="text-muted-foreground text-center py-8">{message}</p>
      </CardContent>
    </Card>
  )
}

export function TabListContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  )
} 