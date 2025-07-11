import React from "react"
import { Label } from "@/components/atoms/label"
import { DynamicInput } from "@/components/atoms/dynamic-input"
import { AddButton } from "@/components/atoms/add-button"

interface DynamicInputListProps {
  items: string[]
  onItemsChange: (items: string[]) => void
  label: string
  placeholder: string
  addButtonText: string
}

export function DynamicInputList({
  items,
  onItemsChange,
  label,
  placeholder,
  addButtonText
}: DynamicInputListProps) {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onItemsChange(newItems)
  }

  const handleItemRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onItemsChange(newItems)
  }

  const handleAddItem = () => {
    onItemsChange([...items, ""])
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {items.map((item, index) => (
        <DynamicInput
          key={index}
          value={item}
          onChange={(value) => handleItemChange(index, value)}
          onRemove={() => handleItemRemove(index)}
          placeholder={`${placeholder} ${index + 1}`}
          index={index}
        />
      ))}
      <AddButton onClick={handleAddItem}>
        {addButtonText}
      </AddButton>
    </div>
  )
} 