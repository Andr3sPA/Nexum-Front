"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/atoms/input"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectNumberProps {
  items: { id: number; name: string }[]
  selectedIds: number[]
  onChange: (selectedIds: number[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MultiSelectNumber({
  items,
  selectedIds,
  onChange,
  placeholder = "Seleccionar opciones...",
  disabled = false,
  className = "",
}: MultiSelectNumberProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleItem = (id: number) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id]
    onChange(newSelected)
  }

  const handleRemoveItem = (id: number) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id))
  }

  const selectedItems = items.filter((item) => selectedIds.includes(item.id))

  const displayText = selectedItems.length > 0
    ? selectedItems.length === 1
      ? selectedItems[0].name
      : `${selectedItems.length} seleccionados`
    : placeholder

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Selected items display */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md"
            >
              <span>{item.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="hover:bg-green-200 rounded-full p-0.5"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#026937] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            selectedItems.length === 0 && "text-neutral-500"
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-neutral-200">
              <Input
                type="text"
                placeholder="Buscar opciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8"
              />
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-neutral-50 flex items-center text-sm",
                      selectedIds.includes(item.id) && "bg-green-50 text-green-700"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 border border-neutral-300 rounded mr-2 flex items-center justify-center",
                      selectedIds.includes(item.id) && "bg-[#026937] border-[#026937]"
                    )}>
                      {selectedIds.includes(item.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    {item.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-neutral-500 text-sm">No se encontraron opciones</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}