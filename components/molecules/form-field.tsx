import type { ReactNode } from "react"
import { Label } from "@/components/atoms/label"

interface FormFieldProps {
  id: string
  label: string
  children: ReactNode
  className?: string
  required?: boolean
}

export function FormField({ id, label, children, className = "", required = false }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  )
  
}
