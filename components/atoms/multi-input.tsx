"use client"

import React, { useState, useRef, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/atoms/input"
import { Badge } from "@/components/atoms/badge"
import { cn } from "@/lib/utils"

interface MultiInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  maxItems?: number
  className?: string
}

export function MultiInput({
  values,
  onChange,
  placeholder = "Type and press Enter to add...",
  maxItems,
  className,
  ...props
}: MultiInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addValue()
    } else if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
      removeValue(values.length - 1)
    }
  }

  const addValue = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !values.includes(trimmedValue)) {
      if (!maxItems || values.length < maxItems) {
        onChange([...values, trimmedValue])
        setInputValue("")
      }
    }
  }

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index)
    onChange(newValues)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className={cn(
        "flex min-h-11 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden",
        className
      )}
      onClick={handleContainerClick}
    >
      {values.map((value, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {value}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeValue(index)
            }}
            className="ml-1 rounded-full hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addValue}
        placeholder={values.length === 0 ? placeholder : ""}
        className="flex-1 min-w-0 border-0 p-0 h-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
        {...props}
      />
    </div>
  )
}
