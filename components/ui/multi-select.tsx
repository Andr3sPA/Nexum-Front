"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar opciones...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options
    return options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [options, searchTerm])

  const handleUnselect = React.useCallback(
    (item: string) => {
      if (!disabled) {
        onChange(selected.filter((i) => i !== item))
      }
    },
    [selected, onChange, disabled],
  )

  const handleSelect = React.useCallback(
    (item: string) => {
      if (!disabled) {
        if (selected.includes(item)) {
          onChange(selected.filter((i) => i !== item))
        } else {
          onChange([...selected, item])
        }
      }
    },
    [selected, onChange, disabled],
  )

  const getLabel = React.useCallback(
    (value: string) => {
      const option = options.find((opt) => opt.value === value)
      return option ? option.label : value
    },
    [options],
  )

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setSearchTerm("")
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Main Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between min-h-[2.5rem] h-auto text-left"
        disabled={disabled}
        onClick={toggleDropdown}
      >
        <div className="flex gap-1 flex-wrap flex-1">
          {selected.length > 0 ? (
            selected.map((item) => (
              <div
                key={item}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 mr-1 mb-1 hover:bg-blue-200 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnselect(item)
                }}
              >
                <span className="max-w-xs truncate">{getLabel(item)}</span>
                {!disabled && <X className="ml-1 h-3 w-3 text-blue-600 hover:text-blue-800 flex-shrink-0" />}
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                {searchTerm ? "No se encontraron opciones" : "No hay opciones disponibles"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center p-2 hover:bg-gray-50 cursor-pointer transition-colors",
                    selected.includes(option.value) && "bg-blue-50 hover:bg-blue-100",
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center justify-center w-4 h-4 mr-2">
                    {selected.includes(option.value) && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      selected.includes(option.value) ? "text-blue-800 font-medium" : "text-gray-700",
                    )}
                  >
                    {option.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
