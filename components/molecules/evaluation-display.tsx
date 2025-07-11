import React from "react"
import { Label } from "@/components/atoms/label"

interface EvaluationDisplayProps {
  title: string
  items: string[]
}

export function EvaluationDisplay({ title, items }: EvaluationDisplayProps) {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">{title}</Label>
      <div className="mt-1 space-y-1">
        {items.map((item, index) => (
          <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
            • {item}
          </div>
        ))}
      </div>
    </div>
  )
} 