"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  allowNegative?: boolean
  clearZeroOnFocus?: boolean
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ 
    className, 
    value, 
    onChange, 
    min, 
    max, 
    allowNegative = false,
    clearZeroOnFocus = true,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(value === 0 ? '' : value.toString())
    const [isFocused, setIsFocused] = React.useState(false)

    // Update display value when prop value changes
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value === 0 ? '' : value.toString())
      }
    }, [value, isFocused])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      
      // Clear field if it shows 0 and clearZeroOnFocus is enabled
      if (clearZeroOnFocus && value === 0) {
        setDisplayValue('')
        e.target.select() // Select all text for easy replacement
      }
      
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      
      // If field is empty on blur, reset to 0 or minimum value
      if (displayValue === '' || displayValue === '-') {
        const fallbackValue = min !== undefined && min > 0 ? min : 0
        setDisplayValue(fallbackValue.toString())
        onChange(fallbackValue)
      }
      
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Allow empty string while typing
      if (inputValue === '') {
        setDisplayValue('')
        return
      }

      // Handle negative sign
      if (inputValue === '-' && allowNegative) {
        setDisplayValue('-')
        return
      }

      // Validate numeric input
      const numericValue = inputValue.replace(/[^\d.-]/g, '')
      
      // Prevent multiple decimal points or negative signs
      const parts = numericValue.split('.')
      if (parts.length > 2) return
      
      const negativeParts = numericValue.split('-')
      if (negativeParts.length > 2) return
      if (!allowNegative && numericValue.includes('-')) return

      // Parse the number
      const parsedValue = parseFloat(numericValue)
      
      // Check if it's a valid number
      if (!isNaN(parsedValue)) {
        // Apply min/max constraints
        let constrainedValue = parsedValue
        if (min !== undefined && constrainedValue < min) {
          constrainedValue = min
        }
        if (max !== undefined && constrainedValue > max) {
          constrainedValue = max
        }
        
        // Update display value and call onChange
        setDisplayValue(constrainedValue.toString())
        onChange(constrainedValue)
      } else if (numericValue === '' || (numericValue === '-' && allowNegative)) {
        // Handle intermediate states while typing
        setDisplayValue(numericValue)
      }
    }

    return (
      <Input
        type="text"
        inputMode="numeric"
        className={cn("text-right", className)}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
        {...props}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }