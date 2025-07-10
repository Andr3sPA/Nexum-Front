import React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RemoveButtonProps {
  onClick: () => void
  className?: string
}

export function RemoveButton({ onClick, className = "" }: RemoveButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`px-3 ${className}`}
    >
      <X className="h-4 w-4" />
    </Button>
  )
} 