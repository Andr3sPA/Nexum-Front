"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddButtonProps {
  onClick: () => void
  className?: string
}

export function AddButton({ onClick, className = "" }: AddButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className={`flex items-center gap-2 ${className}`}>
      <Plus className="h-4 w-4" />
      Agregar
    </Button>
  )
}
