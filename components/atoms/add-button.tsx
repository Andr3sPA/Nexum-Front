"use client"

import React from "react"
import { Button } from "@/components/atoms/button"
import { Plus } from "lucide-react"

interface AddButtonProps {
  onClick: () => void
  children?: React.ReactNode
  className?: string
}

export function AddButton({ onClick, children, className = "" }: AddButtonProps) {
  return (
    <Button 
      type="button"
      variant="outline" 
      size="sm" 
      onClick={onClick} 
      className={`flex items-center gap-2 ${className}`}
    >
      <Plus className="h-4 w-4" />
      {children || "Añadir"}
    </Button>
  )
}