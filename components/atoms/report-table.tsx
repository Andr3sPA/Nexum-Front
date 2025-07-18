import React from "react"
import { cn } from "@/lib/utils"

export interface ReportTableColumn {
  key: string
  label: string
  width?: string
  align?: "left" | "center" | "right"
}

export interface ReportTableProps {
  columns: ReportTableColumn[]
  data: Record<string, any>[]
  className?: string
  emptyMessage?: string
  isLoading?: boolean
}

export const ReportTable: React.FC<ReportTableProps> = ({
  columns,
  data,
  className,
  emptyMessage = "No hay datos para mostrar",
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg border overflow-hidden", className)}>
        <div className="animate-pulse">
          <div className="bg-gray-100 h-12"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-50 h-12 border-t"></div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg border p-8 text-center", className)}>
        <div className="text-gray-500 text-lg">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border overflow-hidden shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-gray-700",
                    column.width && `w-${column.width}`,
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm text-gray-900",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {row[column.key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 