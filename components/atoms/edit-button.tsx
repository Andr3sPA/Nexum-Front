"use client"

import { Edit } from "lucide-react"
import { Button } from "@/components/atoms/button"

interface EditButtonProps {
  onClick: () => void
  className?: string
  text?: string
}

export function EditButton({ onClick, className = "", text = "Editar" }: EditButtonProps) {
  return (
    <Button 
      type="button"
      variant="outline" 
      size="sm" 
      onClick={onClick} 
      className={`flex items-center gap-2 ${className}`}
    >
      <Edit className="h-4 w-4" />
      {text}
    </Button>
  )
}
