import { useState } from "react"
import { z } from "zod"
import { sanitizeText } from "@/lib/validation"

export function useFormValidation<T extends z.ZodType>(schema: T) {
  type FormData = z.infer<T>
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  // Validate a single field
  const validateField = (field: keyof FormData, value: unknown): boolean => {
    const fieldSchema = z.object({ [field]: schema.shape[field] })
    const result = fieldSchema.safeParse({ [field]: value })
    
    if (!result.success) {
      const fieldError = result.error.errors[0]?.message || "Invalid value"
      setErrors(prev => ({ ...prev, [field]: fieldError }))
      return false
    }
    
    // Clear error if validation passes
    setErrors(prev => ({ ...prev, [field]: undefined }))
    return true
  }
  
  // Validate entire form
  const validateForm = (data: Partial<FormData>): boolean => {
    const result = schema.safeParse(data)
    
    if (!result.success) {
      const newErrors: Partial<Record<keyof FormData, string>> = {}
      
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof FormData
        newErrors[field] = err.message
      })
      
      setErrors(newErrors)
      return false
    }
    
    setErrors({})
    return true
  }
  
  // Sanitize form data
  const sanitizeFormData = (data: Partial<FormData>): Partial<FormData> => {
    const sanitized: Partial<FormData> = {}
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string") {
        sanitized[key as keyof FormData] = sanitizeText(value) as any
      } else {
        sanitized[key as keyof FormData] = value as any
      }
    })
    
    return sanitized
  }
  
  return {
    errors,
    validateField,
    validateForm,
    sanitizeFormData,
  }
}