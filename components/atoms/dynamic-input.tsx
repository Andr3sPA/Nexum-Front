import React from "react"
import { Input } from "@/components/ui/input"
import { RemoveButton } from "@/components/atoms/remove-button"

interface DynamicInputProps {
  value: string
  onChange: (value: string) => void
  onRemove: () => void
  placeholder: string
  index: number
}

export function DynamicInput({ 
  value, 
  onChange, 
  onRemove, 
  placeholder, 
  index 
}: DynamicInputProps) {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <RemoveButton onClick={onRemove} />
    </div>
  )
} 